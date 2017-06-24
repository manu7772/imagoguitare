<?php

namespace site\siteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use Labo\Bundle\AdminBundle\Entity\LaboUser;
use site\adminsiteBundle\Entity\message;
use Labo\Bundle\AdminBundle\services\flashMessage;

use \DateTime;
use \Exception;

class messageController extends Controller {

	/**
	 * save new message
	 * @return JsonResponse
	 */
	public function sendAction(Request $Request) {
		$data = $Request->request->all();
		$em = $this->getDoctrine()->getManager();
		$session = $Request->getSession();
		$trans = $this->get('translator');
		$aeReponse = $this->get('aetools.aeReponse');
		$aeReponse->setResult(true);
		$message = new message();
		// $statut = $em->getRepository('Labo\Bundle\AdminBundle\Entity\statut')->defaultVal();
		// if(is_array($statut)) $statut = reset($statut);
		// $message->setStatut($statut);
		// $message = $this->get('aetools.aeServiceMessage')->getNewEntity('site\adminsiteBundle\Entity\message');
		$user = null;
		if(isset($data['user_id'])) {
			// user id given
			$user = $this->get('aetools.aeServiceUser')->getRepo()->findOneById($data['user_id']);
		} else {
			// find by email
			$user = $this->get('aetools.aeServiceUser')->getRepo()->findOneByEmail($data['email']);
		}

		// ERRORS
		if((!isset($data['name']) || !isset($data['email'])) && !($user instanceOf LaboUser)) {
			// no user, not enough data
			$aeReponse->setResult(false)->setMessage($trans->trans('messagebox.nodata'));
		}
		if(!isset($data['message'])) {
			$aeReponse->setResult(false)->setMessage($trans->trans('messagebox.nodata'));
		} else if(strlen(trim(strip_tags($data['message']))) < 1) {
			$aeReponse->setResult(false)->setMessage($trans->trans('messagebox.nodata'));
		}

		if($aeReponse->getResult() === true) {
			$aeReponse->setMessage($trans->trans('messagebox.message_sent'));
			$message->setNom(isset($data['name']) ? $data['name'] : $user->getNom());
			$message->setEmail(isset($data['email']) ? $data['email'] : $user->getEmail());
			$message->setUser($user); // replaces name and email is user is instance of LaboUser
			$message->setMessage(strip_tags($data['message']));
			$message->setIp($Request->getClientIp());
			$message->setCreation(new DateTime());
			if($this->getUser() !== $user || !($user instanceOf LaboUser)) $message->setConnected(false);
			$em->persist($message);
			try {
				$em->flush();
			} catch (Exception $e) {
				$aeReponse->setResult(false)->setMessage($trans->trans('messagebox.message_error'))->setData($e);
			}
			if($aeReponse->getResult() === true) {
				// emails
				$this->get('aetools.aeEmail')->emailCollatoratorMessage($message);
				$this->get('aetools.aeEmail')->emailCopyToUserAfterMessage($message);
				// session user data
				$userdata = $session->get('message_user');
				if(!is_array($userdata)) $userdata = array();
				$userdata['user'] = $user instanceOf LaboUser ? $user->getId() : false;
				$userdata['message'] = array();
				$userdata['message']['name'] = isset($data['name']) ? $data['name'] : $user->getNom();
				$userdata['message']['email'] = isset($data['email']) ? $data['email'] : $user->getEmail();
				$userdata['message']['message'] = $data['message'];
				// set data in session
				$session->set('message_user', $userdata);
				$aeReponse->setData($session->get('message_user'));
			}
		}
		// RETURN
		if($Request->isXmlHttpRequest()) {
			// AJAX
			return $aeReponse->getArrayJSONreponse();
		} else {
			// GET
			$this->get('flash_messages')->send(array(
				'title'		=> 'Message',
				'text'		=> $aeReponse->getMessage(),
				'type'		=> $aeReponse->getResult() ? flashMessage::MESSAGES_SUCCESS : flashMessage::MESSAGES_ERROR,
			));
			$url = $Request->headers->get('referer');
			if(!is_string($url)) $url = $this->generateUrl('sitesite_homepage');
			return $this->redirect($url);
		}
	}

}
