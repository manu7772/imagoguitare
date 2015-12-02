<?php

namespace site\interfaceBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use AcmeGroup\laboInspiniaBundle\services\flashMessage;

use \Exception;

class generateController extends Controller {

	protected $classnames = null;

	public function indexAction($action = null, $entite = null) {
		$data = array();
		$data['action'] = $action;
		$data['entite'] = $entite;
		if($entite != null) $data['classname'] = $this->getClassname($entite);
		$data['created'] = array();
		$data['emptied'] = array();
		switch ($action) {
			case 'create':
				if($entite != null) $data['created'][$entite] = $this->generateEntite($entite);
				break;
			case 'empty':
				if($entite != null) $data['emptied'][$entite] = $this->emptyEntity($entite);
				break;
			default:
				break;
		}
		// view
		$em = $this->getDoctrine()->getManager();
		foreach ($this->getEntities() as $name => $classname) {
			$data['info'][$name]['classname'] = $classname;
			$data['info'][$name]['size'] = $em->createQuery("SELECT COUNT(element.id) FROM ".$classname." element")->getSingleScalarResult();
		}
		// informations entités
		return $this->render('siteinterfaceBundle:Default:install.html.twig', $data);
	}

	protected function getEntities() {
		if(!is_array($this->classnames)) {
			$this->classnames = array();
			$entities = $this->get('aetools.aeEntities')->getListOfEnties();
			foreach ($entities as $classname => $name) {
				$this->classnames[$name] = $classname;
			}
		}
		return $this->classnames;
	}

	protected function getClassname($entite) {
		$this->getEntities();
		return isset($this->classnames[$entite]) ? $this->classnames[$entite] : false;
	}

	protected function generateEntite($entite = null) {
		switch ($entite) {
			case 'pageweb':
				$data = array(
					array(
						'nom' => 'homepage',
						'homepage' => true,
						'code' => '<p>Guitare, Basse, Ukulélé</p>',
						'title' => 'Imago Guitare',
						'titreh1' => '',
						'keywords' => '',
						'metadescription' => 'Imago Guitare',
						'modele' => 'src/site/siteBundle/Resources/views/pages_web/presentation.html.twig',
						),
					);
					return $this->fillEntity($data, $entite);
				break;
			case 'tag':
				$data = array(
					array('nom' => 'Imago'),
					array('nom' => 'guitare'),
					array('nom' => 'basse'),
					array('nom' => 'Ukulélé'),
					);
					return $this->fillEntity($data, $entite);
				break;
			case 'statut':
				$data = array(
					array('nom' => 'Actif','descriptif' => 'Statut actif',),
					array('nom' => 'Inactif','descriptif' => 'Statut inactif',),
					array('nom' => 'Expired','descriptif' => 'Statut expiré',),
					array('nom' => 'Test','descriptif' => 'Statut pour tests',),
					);
					return $this->fillEntity($data, $entite);
				break;
			case 'fileFormat':
				return $this->get('aetools.media')->initiateFormats(true);
				break;
			case 'User':
				return $this->get('service.users')->createUsers(true);
				break;
			
			default:
				return false;
				break;
		}
	}

	/**
	 * Vide l'entité $entite
	 * @param string $entite
	 * @return integer
	 */
	protected function emptyEntity($entite) {
		$em = $this->getDoctrine()->getManager();
		$number = 0;
		switch ($entite) {
			case 'User':
				$number = $this->get('service.users')->deleteAllUsers();
				break;
			case 'fileFormat':
				$number = $this->get('aetools.media')->eraseAllFormats();
				break;
			default:
				$entities = $em->getRepository($this->getClassname($entite))->findAll();
				foreach ($entities as $ent) {
					$em->remove($ent);
					$number++;
				}
				$em->flush();
				break;
		}
		// remise à zéro de l'index de la table
		$em->getConnection()->executeUpdate("ALTER TABLE ".$entite." AUTO_INCREMENT = 1;");
		return $number;
	}

	/**
	 * Hydrate l'entité $entite avec $data
	 * @param array $data
	 * @param string $entite
	 * @return array
	 */
	protected function fillEntity($data, $entite, $empty = true) {
		$classname = $this->getClassname($entite);
		if($empty === true) $this->emptyEntity($entite);
		$em = $this->getDoctrine()->getManager();
		$newdata = array();
		$attrMethods = array('set', 'add');
		foreach ($data as $key => $dat) {
			$newdata[$key] = new $classname();
			foreach ($dat as $attribute => $value) {
				foreach ($attrMethods as $method) {
					$m = $method.ucfirst($attribute);
					if(method_exists($newdata[$key], $m)) $newdata[$key]->$m($value);
				}
			}
			$em->persist($newdata[$key]);
		}
		if(count($newdata) > 0) $em->flush();
		return $newdata;
	}


}
