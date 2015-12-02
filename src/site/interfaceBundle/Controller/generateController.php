<?php

namespace site\interfaceBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use AcmeGroup\laboInspiniaBundle\services\flashMessage;

use \Exception;

class generateController extends Controller {

	public function indexAction($entite = null) {
		$data = array();
		$data['entite'] = $entite;
		$data['created_users'] = $this->get('service.users')->usersExist(true);
		return $this->render('siteinterfaceBundle:Default:install.html.twig', $data);
	}


}
