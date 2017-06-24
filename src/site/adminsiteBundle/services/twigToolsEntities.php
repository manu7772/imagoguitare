<?php

namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\PersistentCollection;
use \Twig_Extension;
use \Twig_SimpleFilter;
use \Twig_SimpleFunction;

use site\adminsiteBundle\Entity\site;
// use site\adminsiteBundle\Entity\article;
// use Labo\Bundle\AdminBundle\services\aeData;
use Labo\Bundle\AdminBundle\Entity\LaboUser;
use Labo\Bundle\AdminBundle\Entity\nested;

class twigToolsEntities extends Twig_Extension {

    const NAME                  = 'twigToolsEntities';			// nom du service
    const CALL_NAME             = 'aetools.twigToolsEntities';	// comment appeler le service depuis le controller/container


	private $container;
	private $trans;
	private $securityContext;
	private $session;

	public function __construct(ContainerInterface $container) {
		$this->container = $container;
		$this->trans = $this->container->get('translator');
		$this->securityContext = $this->container->get('security.context');
		$this->session = $this->container->get('request')->getSession();
	}

	public function getFunctions() {
		return array(
			// article
			new Twig_SimpleFunction('selectClasses', array($this, 'selectClasses')),
			new Twig_SimpleFunction('selectListClasses', array($this, 'selectListClasses')),
			new Twig_SimpleFunction('selectNestedClasses', array($this, 'selectNestedClasses')),
			);
	}

	public function getFilters() {
		return array(
			// filters
			// new Twig_SimpleFilter('price', array($this, 'price')),
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

	public function selectClasses($item, $classes, site $siteContext = null) {
		$classes = (array) $classes;
		$site_optionArticlePhotos = $siteContext instanceOf site ? !$siteContext->getOptionArticlePhotosOnly() : true;
		$site_optionArticlePrice = $siteContext instanceOf site ? !$siteContext->getOptionArticlePriceOnly() : true;
		if(is_object($item) && method_exists($item, 'getShortName') && in_array($item->getShortName(), $classes)) {
			$auth = true;
			// actions for specific entities
			switch($item->getShortName()) {
				case 'article':
					$auth = $auth && ($site_optionArticlePhotos || $item->getImage() !== null);
					$auth = $auth && ($site_optionArticlePrice || $item->getPrix() > 0);
					break;
			}
			// Granted role
			$grant = 'IS_AUTHENTICATED_ANONYMOUSLY';
			if(method_exists($item, 'getStatut')) $grant = $item->getStatut()->getNiveau();
			$auth = $auth && $this->securityContext->isGranted($grant);
			if($auth) return $item;
		}
		return null;
	}

	public function selectListClasses($items, $classes, site $siteContext = null) {
		$result = new ArrayCollection();
		if(method_exists($items, 'toArray')) $items = $items->toArray();
		$items = (array)$items;
		$classes = (array) $classes;
		foreach($items as $item) {
			if(method_exists($item, 'toArray')) $item = $item->toArray();
			if(is_array($item)) {
				foreach($this->selectListClasses($item, $classes, $siteContext) as $item3) if(!$result->contains($item3)) $result->add($item3);
			} else if($item instanceOf nested) {
				foreach($this->selectNestedClasses($item, $classes, $siteContext, false) as $item3) if(!$result->contains($item3)) $result->add($item3);
			} else if(is_object($item) && !$result->contains($item)) {
				$item2 = $this->selectClasses($item, $classes, $siteContext);
				if(is_object($item2)) $result->add($item2);
			}
		}
		return $result;
	}

	public function selectNestedClasses($items, $classes, site $siteContext = null, $recursive = true) {
		$result = new ArrayCollection();
		if(method_exists($items, 'toArray')) $items = $items->toArray();
		$classes = (array) $classes;
		$deepth = $recursive ? 'getAllNestedChildsByClass' : 'getNestedChildsByClass';

		if(is_object($items) && method_exists($items, $deepth)) {
			foreach($items->$deepth($classes, true) as $item) {
				foreach($this->selectNestedClasses($item, $classes, $siteContext, $recursive) as $item2) if(!$result->contains($item2)) $result->add($item2);
			}
		} else if(is_array($items) || $items instanceOf ArrayCollection || $items instanceOf PersistentCollection) {
			if(method_exists($items, 'toArray')) $items = $items->toArray();
			foreach($items as $item) {
				foreach($this->selectNestedClasses($item, $classes, $siteContext, $recursive) as $item2) if(!$result->contains($item2)) $result->add($item2);
			}
		} else if(is_object($items) && !$result->contains($items)) {
			$item = $this->selectClasses($items, $classes, $siteContext);
			if(is_object($item)) $result->add($item);
		}
		return $result;
	}




}








