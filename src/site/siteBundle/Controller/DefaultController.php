<?php

namespace site\siteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Labo\Bundle\AdminBundle\services\flashMessage;
use Symfony\Component\HttpFoundation\Request;

use site\adminsiteBundle\Entity\site;
use site\adminsiteBundle\Entity\message;
use site\adminsiteBundle\Entity\pageweb;
use site\adminsiteBundle\Form\contactmessageType;
use Labo\Bundle\AdminBundle\Entity\LaboUser;

use \DateTime;
use \Exception;

class DefaultController extends Controller {

	const ACCEPT_ALIAS_ITEMS = false;
	const ADD_ALIAS_ITEMS = true;
	const FIND_EXTENDED = true;
	const SITE_DATA = 'sitedata';


	public function indexAction(Request $Request) {
		$data['pageweb'] = $this->get('aetools.aeServicePageweb')->getRepo()->findOneByDefault(1);
		return $this->render($data['pageweb']->getTemplate(), $data);
	}


	public function categorieAction($itemSlug, $parentSlug = null, Request $Request) {
		// categorie
		$data['categorie'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($itemSlug);
		$data['categorie_parent'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($parentSlug);
		$data['pageweb'] = $data['categorie']->getPageweb() != null ? $data['categorie']->getPageweb() : $this->get('aetools.aeServicePageweb')->getRepo()->findOneBySlug('categorie');
		return $this->render($data['pageweb']->getTemplate(), $data);
	}

	public function pagewebAction($itemSlug, $parentSlug = null, Request $Request) {
		$data['pageweb'] = $this->get('aetools.aeServicePageweb')->getRepo()->findOneBySlug($itemSlug);
		$data['categorie'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($parentSlug);
		return $this->render($data['pageweb']->getTemplate(), $data);
	}

	////////////////////
	// ARTICLES
	////////////////////

	public function articleAction($itemSlug, $parentSlug = null) {
		$data['article'] = $this->get('aetools.aeServiceArticle')->getRepo()->findOneBySlug($itemSlug);
		$data['categorie'] = null;
		if($parentSlug != null) {
			$data['categorie'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($parentSlug);
			if(!is_object($data['categorie'])) $data['categorie'] = $this->get('aetools.aeServicePageweb')->getRepo()->findOneBySlug($parentSlug);
		} else {
			$data['categorie'] = $this->get('aetools.aeServiceSite')->getRepo()->findOneByDefault(1)->getMenuArticle();
		}
		$data['pageweb'] = $this->get('aetools.aeServicePageweb')->getRepo()->findOneByNom('Article');
		return $this->render($data['pageweb']->getTemplate(), $data);
	}

	// public function articlesByCategorieAction($categorieSlug) {
	// 	$data['categorie'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($categorieSlug);
	// 	// $data['entites'] = $data['categorie']->getAllNestedChildsByClass('article');
	// 	$data['pageweb'] = $this->get('aetools.aeServicePageweb')->getRepo()->findOneBySlug($itemSlug);
	// 	return $this->render($data['pageweb']["template"], $data);
	// }












	protected function pagewebactions(&$data) {
		$trans = $this->get('translator');
		switch ($data['pageweb']["modelename"]) {
			case 'contact':
				// page contact
				if($this->getUser() instanceOf LaboUser) {
					// user connected : delete user info in session
					$olddata = $this->getRequest()->getSession()->get('user');
					unset($olddata['nom']);
					unset($olddata['prenom']);
					unset($olddata['email']);
					unset($olddata['telephone']);
					$this->getRequest()->getSession()->set('user', $olddata);
				}
				$message = $this->getNewEntity('site\adminsiteBundle\Entity\message');
				$form = $this->createForm(new contactmessageType($this, []), $message);
				// $this->repo = $this->em->getRepository('site\adminsiteBundle\Entity\message');
				$request = $this->getRequest();
				if($request->getMethod() == 'POST') {
					// formulaire reçu
					$form->bind($request);
					if($form->isValid()) {
						// get IP & DateTime
						$message->setIp($request->getClientIp());
						$message->setCreation(new DateTime());
						if($this->getUser() instanceOf LaboUser) {
							$message->setUser($this->getUser());
						}
						// enregistrement
						$this->em->persist($message);
						$this->em->flush();
						// $data['message_success'] = "message.success";
						$this->get('flash_messages')->send(array(
							'title'		=> ucfirst($trans->trans('message.title.sent')),
							'type'		=> flashMessage::MESSAGES_SUCCESS,
							'text'		=> ucfirst($trans->trans('message.success')),
						));
						// envoi mail aux admin (si option User::mailSitemessages == true)
						// $collaborateurs = $this->getDoctrine()->getManager()->getRepository('Labo\Bundle\AdminBundle\Entity\LaboUser')->findCollaborators($this->getRequest()->getSession()->get('sitedata')['id']);
						$this->get('aetools.aeEmail')->emailCollatoratorMessage($message);
						$this->get('aetools.aeEmail')->emailCopyToUserAfterMessage($message);
						// nouveau formulaire
						// info in session…
						$olddata = $this->getRequest()->getSession()->get('user');
						$olddata['nom'] = $message->getNom();
						$olddata['prenom'] = $message->getPrenom();
						$olddata['email'] = $message->getEmail();
						$olddata['telephone'] = $message->getTelephone();
						$this->getRequest()->getSession()->set('user', $olddata);

						$form = $this->createForm(new contactmessageType($this, []), $this->getNewEntity('site\adminsiteBundle\Entity\message'));
						$data['redirect'] = $this->generateUrl('site_pageweb_pageweb', array('itemSlug' => $data['pageweb']['slug']));
					} else {
						// $data['message_error'] = "message.error";
						$this->get('flash_messages')->send(array(
							'title'		=> ucfirst($trans->trans('message.title.error')),
							'type'		=> flashMessage::MESSAGES_ERROR,
							'text'		=> ucfirst($trans->trans('message.error')),
						));
					}
				}
				$data['message_form'] = $form->createView();
				// ouvert/fermé
				$now = new DateTime;
				$cesoir = new DateTime;
				$cesoir->modify('tomorrow');
				$data['ouvert']['next'] = $this->get('aetools.aeServiceCalendar')->getRepo()->findNextCal('boutique-de-poncin', 'boutique', $now, 'OUVERT');
				$data['ouvert']['now'] = $this->get('aetools.aeServiceCalendar')->getRepo()->findCalendarsOfItem('boutique-de-poncin', 'boutique', $now, $now, 'OUVERT');
				break;
			case 'articles':
				if(is_string($data['categorie'])) {
					$data['categorie'] = $this->get('aetools.aeServiceCategorie')->getRepo()->findOneBySlug($data['categorie']);
				}
				break;
			case 'paniercommande':
				$livr = new DateTime();
				$infoDate = $this->get('aetools.aeServiceCalendar')->verifDate($livr, 'boutique', 'boutique-de-poncin', 'OUVERT', true)->getData();
				$infoDate_unserialized = $this->get('aetools.aeServiceCalendar')->verifDate($livr, 'boutique', 'boutique-de-poncin', 'OUVERT', false)->getData();
				// echo('<pre>');var_dump($infoDate);die('</pre>');
				if(count($infoDate_unserialized['next_open']) > 0) {
					$data['nextOpen'] = $infoDate_unserialized['next_open'][0];
					$data['command_form'] = $this->createFormBuilder(null, array('attr' => array('checkdate-url' => $this->generateUrl('panier_commande_verifdate'), 'checkdate-initdata' => json_encode($infoDate))))
						->setAction($this->generateUrl('panier_pageweb_valid'))
						->setMethod('POST')
						->add('date', 'insDatepicker', array(
							'data' => $data['nextOpen']->getStartDate(),
							'required' => true,
							))
						->add('validdate', 'hidden', array(
							'data' => $data['nextOpen']->getStartDate()->format(DATE_ATOM),
							'required' => true,
							))
						->add('commandeready', 'hidden', array(
							'data' => $infoDate_unserialized['commandeready']['matin'] !== null ? $infoDate_unserialized['commandeready']['matin'] : $infoDate_unserialized['commandeready']['aprem'],
							'required' => true,
							))
						->add('demijournee', 'insRadio', array(
							'required' => true,
							'label_attr' => array('class' => 'radio-inline'),
							'choices'  => array(
								'matin' => 'matin',
								'après-midi' => 'aprem',
								),
							'choices_as_values' => true,
							'multiple' => false,
							'expanded' => true,
							))
						->add('submit', 'submit', array(
							'label' => '<i class="fa fa-check fa-fw m-r-xs"></i> VALIDER VOTRE COMMANDE',
							'attr' => array(
								'class' => 'btn btn-xs btn-maroon m-l-xs',
								'pla-enable' => 'globals.panier.quantite > 0',
								)
							))
						->getForm()
						->createView()
						;
				}

				break;
			default:
				# code...
				break;
		}
		return $data;
	}

	protected function getNewEntity($classname) {
		$newEntity = new $classname();
		$this->em = $this->getDoctrine()->getManager();
		if(method_exists($newEntity, 'setStatut')) {
			// si un champ statut existe
			$statut = $this->em->getRepository('Labo\Bundle\AdminBundle\Entity\statut')->defaultVal();
			if(is_array($statut)) $statut = reset($statut);
			$newEntity->setStatut($statut);
		}
		if($classname == 'site\adminsiteBundle\Entity\message') {
			if($this->getUser() instanceOf LaboUser) {
				$newEntity->setUser($this->getUser());
			} else {
				$userSessionData = $this->getRequest()->getSession()->get('user');
				// echo('<pre>');var_dump($userSessionData);echo('</pre>');
				if(isset($userSessionData['nom'])) $newEntity->setNom($userSessionData['nom']);
				if(isset($userSessionData['prenom'])) $newEntity->setPrenom($userSessionData['prenom']);
				if(isset($userSessionData['email'])) $newEntity->setEmail($userSessionData['email']);
				if(isset($userSessionData['telephone'])) $newEntity->setTelephone($userSessionData['telephone']);
			}
		}
		return $newEntity;
	}



}
