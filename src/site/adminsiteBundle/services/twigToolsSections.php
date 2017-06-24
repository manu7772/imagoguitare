<?php

namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\PersistentCollection;
use \Twig_Extension;
use \Twig_SimpleFilter;
use \Twig_SimpleFunction;

use site\adminsiteBundle\Entity\site;
use site\adminsiteBundle\Entity\section;
// use Labo\Bundle\AdminBundle\services\aeData;
use Labo\Bundle\AdminBundle\Entity\LaboUser;

use \Exception;

class twigToolsSections extends Twig_Extension {

    const NAME                  = 'twigToolsSections';			// nom du service
    const CALL_NAME             = 'aetools.twigToolsSections';	// comment appeler le service depuis le controller/container


	private $container;
	private $trans;
	private $twig;
	// private $session;
	private $securityContext;

	public function __construct(ContainerInterface $container) {
		$this->container = $container;
		$this->trans = $this->container->get('translator');
		$this->twig = $this->container->get('twig');
		// $this->twig = $this->container->get('templating'); --> SURTOUT PAS !!!
		// $this->session = $this->container->get('request')->getSession();
		$this->securityContext = $this->container->get('security.context');
	}

	public function getFunctions() {
		return array(
			// functions
			new Twig_SimpleFunction('section', array($this, 'section')),
			new Twig_SimpleFunction('sections', array($this, 'sections')),
			new Twig_SimpleFunction('section_rest', array($this, 'section_rest')),
			);
	}

	public function getFilters() {
		return array(
			// filters
			new Twig_SimpleFilter('displayed', array($this, 'displayed')),
			);
	}



	////////////////////////////////////////////////////////////////////////////////////////////////////////
	// IDENTIFICATION CLASSE
	////////////////////////////////////////////////////////////////////////////////////////////////////////

	public function __toString() {
		return $this->getNom();
	}

	public function getNom() {
		return self::NAME;
	}

	public function callName() {
		return self::CALL_NAME;
	}

	/**
	 * Renvoie le nom de la classe
	 * @return string
	 */
	public function getName() {
		return get_called_class();
	}

	public function displayed($section) {
		if(!($section instanceOf section)) throw new Exception("twigToolsSections:displayed() error : parameter is not an instance of section.", 1);
		return method_exists($section, 'isDisplayed') ? $section->isDisplayed() : false;
	}

	public function sections($sections, $data = array(), $onlyNotDisplayed = false, $testGrants = true) {
		if(!($sections instanceOf section) && !($sections instanceOf ArrayCollection) && !is_array($sections) && !($sections === null)) throw new Exception("twigToolsSections:sections() error : parameter is not a collection (array or arrayCollection) or a section. ".json_encode($sections)." given.", 1);
		if($sections === null) return;
		if($sections instanceOf section) $this->section($sections, $data, $onlyNotDisplayed);
		foreach($sections as $section) if($section instanceOf section) $this->section($section, $data, $onlyNotDisplayed);
	}

	public function section_rest($sections, $data = array(), $testGrants = true) {
		$this->sections($sections, $data, true);
	}

	public function section($section, $data = array(), $onlyNotDisplayed = false, $testGrants = true) {
		if(!($section instanceOf section)) throw new Exception("twigToolsSections:section() error : parameter is not an instance of section.", 1);
		if(($onlyNotDisplayed === false || !$this->displayed($section)) && ($this->securityContext->isGranted($section->getStatut()->getNiveau()) || $testGrants === false)) {
			$section->setDisplayed(true);
			echo $this->twig->render($section->getTemplate(), array_merge(array('section' => $section), (array)$data));
		}
	}




}








