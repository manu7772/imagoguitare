<?php

namespace site\siteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class sectionController extends Controller {

	/**
	 * section with slugname of entity
	 * @param string $slug
	 * @return Response
	 */
	public function defaultAction($slug) {
		return new Response('ok');
	}

}
