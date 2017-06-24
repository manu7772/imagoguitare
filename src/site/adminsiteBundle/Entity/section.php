<?php

namespace site\adminsiteBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

use Labo\Bundle\AdminBundle\Entity\item;
use Labo\Bundle\AdminBundle\Entity\subentity;

/**
 * section
 *
 * @ORM\Entity(repositoryClass="site\adminsiteBundle\Entity\sectionRepository")
 * @UniqueEntity(fields={"nom"}, message="section.existe")
 * 
 * @ORM\Table(name="section", options={"comment":"sections du site"})
 * @ORM\HasLifecycleCallbacks
 */
class section extends item {

	/**
	 * @var string
	 * @ORM\Column(name="nom", type="string", length=100, nullable=false, unique=true)
	 * @Assert\NotBlank(message = "entity.notblank.nom")
	 * @Assert\Length(
	 *      min = "3",
	 *      max = "256",
	 *      minMessage = "Le nom doit comporter au moins {{ limit }} lettres.",
	 *      maxMessage = "Le nom doit comporter au maximum {{ limit }} lettres."
	 * )
	 */
	protected $nom;

	/**
	 * @var string
	 * @ORM\Column(name="code", type="text", nullable=true, unique=false)
	 */
	protected $code;

	/**
	 * @ORM\ManyToMany(targetEntity="Labo\Bundle\AdminBundle\Entity\subentity")
	 * @ORM\JoinColumn(nullable=true, unique=false, onDelete="SET NULL")
	 */
	protected $subentitys;

	/**
	 * @var string
	 * @ORM\Column(name="modele", type="string", length=255, nullable=true, unique=false)
	 */
	protected $modele;

	/**
	 * @var string
	 * @ORM\Column(name="action", type="string", length=255, nullable=true, unique=false)
	 */
	protected $action;

	protected $displayed;

	public function __construct() {
		parent::__construct();
		$this->nom = null;
		$this->code = null;
		$this->modele = null;
		$this->setAction(null); // 'default'
		$this->subentitys = new ArrayCollection();
		$this->displayed = false;
	}

	/**
	 * Un élément par défaut dans la table est-il optionnel ?
	 * @return boolean
	 */
	public function isDefaultNullable() {
		return true;
	}

	/**
	 * Peut'on attribuer plusieurs éléments par défaut ?
	 * true 		= illimité
	 * integer 		= nombre max. d'éléments par défaut
	 * false, 0, 1 	= un seul élément
	 * @return boolean
	 */
	public function isDefaultMultiple() {
		return true;
	}


	/**
	 * @ORM\PostLoad
	 */
	public function PostLoad() {
		$this->displayed = false;
	}

	public function isDisplayed() {
		return $this->displayed;
	}
	public function setDisplayed($value = true) {
		$this->displayed = (boolean)$value;
		return $this;
	}


	/**
	 * Set code
	 * @param string $code
	 * @return section
	 */
	public function setCode($code = null) {
		$this->code = $code;
		if(strip_tags(preg_replace('#([[:space:]])+#', '', $this->code)) == '') $this->code = null;
		return $this;
	}

	/**
	 * Get code
	 * @return string 
	 */
	public function getCode() {
		return $this->code;
	}

	/**
	 * set subentitys
	 * @param ArrayCollection $subentitys
	 * @return section
	 */
	public function setSubentitys(ArrayCollection $subentitys) {
		$this->subentitys = $subentitys;
		return $this;
	}

	/**
	 * add subentity
	 * @param subentity $subentity
	 * @return section
	 */
	public function addSubentity(subentity $subentity) {
		if(!$this->subentitys->contains($subentity)) $this->subentitys->add($subentity);
		return $this;
	}

	/**
	 * remove subentity
	 * @param subentity $subentity
	 * @return section
	 */
	public function removeSubentity(subentity $subentity) {
		if($this->subentitys->contains($subentity)) $this->subentitys->removeElement($subentity);
		return $this;
	}

	/**
	 * get subentitys
	 * @return ArrayCollection
	 */
	public function getSubentitys() {
		return $this->subentitys;
	}


	/**
	 * Set action
	 * @param string $action
	 * @return section
	 */
	public function setAction($action = null) {
		$this->action = trim((string)$action) == '' ? null : 'sitesiteBundle:section:'.$action;
		return $this;
	}

	/**
	 * Get action
	 * @return string 
	 */
	public function getAction() {
		$exp = explode(':', $this->action);
		return end($exp);
	}


	/**
	 * Set modele
	 * @param string $modele
	 * @return section
	 */
	public function setModele($modele = null) {
		$this->modele = $modele;
		return $this;
	}

	/**
	 * Get modele
	 * @return string 
	 */
	public function getModele() {
		return $this->modele;
	}

	/**
	 * Get modelename
	 * @return string 
	 */
	public function getModelename() {
		$path = explode("/", $this->modele);
		return preg_replace("#\.section\.twig$#", '', end($path));
	}

	/**
	 * Get template
	 * @return string 
	 */
	public function getTemplate() {
		$path = preg_split('#(src/|Resources/|views/|/)#', $this->modele);
		return implode(array_slice($path, 0, -2)).':'.$path[count($path)-2].':'.$path[count($path)-1];
	}

}