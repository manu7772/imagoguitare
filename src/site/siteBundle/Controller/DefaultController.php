<?php

namespace site\siteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller {

	public function indexAction() {
		$this->em = $this->getDoctrine()->getManager();
		$this->repo = $this->em->getRepository('site\adminBundle\Entity\pageweb');
		$data['pageweb'] = $this->repo->findOneByHomepage(1);
		// chargement de la pageweb
		if(is_object($data['pageweb'])) {
			return $this->render($data['pageweb']->getTemplate(), $data);
		} else {
			// si aucune page web… chargement de la page par défaut…
			$data['title'] = 'Imago GUITARE - Site web';
			$data['description'] = 'Luthier contemporain, Guitare, Basse, Ukulélé';
			$data['keywords'] = 'Luthier contemporain, Guitare, Basse, Ukulélé';
			return $this->render('sitesiteBundle:Default:index.html.twig', $data);
		}
	}

	public function pagewebAction($pageweb, $params = null) {
		if($params == null) $params = array();
		$data = $params;
		// find $pageweb
		$this->em = $this->getDoctrine()->getManager();
		$this->repo = $this->em->getRepository('site\adminBundle\Entity\pageweb');
		$data['pageweb'] = $this->repo->findOneBySlug($pageweb);
		// chargement de la pageweb
		return $this->render($data['pageweb']->getTemplate(), $data);
	}

	public function topmenuAction($levels = 0, $icons = true) {
		$data['menu'] = $this->get('aeMenus')->getMenu('site-menu');
		$data['options']['levels'] = $levels;
		$data['options']['icons'] = $icons;
		// récupération route/params requête MASTER
		$stack = $this->get('request_stack');
		$masterRequest = $stack->getMasterRequest();
		$data['infoRoute']['_route'] = $masterRequest->get('_route');
		$data['infoRoute']['_route_params'] = $masterRequest->get('_route_params');
		return $this->render('sitesiteBundle:blocks:topmenu.html.twig', $data);
	}

	public function sidemenuAction() {
		$user = $this->getUser();
		if(is_object($user)) {
			// récupération route/params requête MASTER
			$stack = $this->get('request_stack');
			$masterRequest = $stack->getMasterRequest();
			$data['infoRoute']['_route'] = $masterRequest->get('_route');
			$data['infoRoute']['_route_params'] = $masterRequest->get('_route_params');
			// menu
			$data['menu'] = $this->get('aeMenus')->getMenu('admin-sidemenu');
			$data['menu']['menu']['menu']['users']['path']['params']['name'] = $user->getUsername();
			return $this->render('sitesiteBundle:blocks:sidemenu.html.twig', $data);
		} else {
			return new Response(null);
		}
	}

}
