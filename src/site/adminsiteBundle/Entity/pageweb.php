<?php

namespace site\adminsiteBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

use Labo\Bundle\AdminBundle\Entity\item;
use Labo\Bundle\AdminBundle\Entity\subentity;

/**
 * pageweb
 *
 * @ORM\Entity(repositoryClass="site\adminsiteBundle\Entity\pagewebRepository")
 * @UniqueEntity(fields={"nom"}, message="pageweb.existe")
 * 
 * @ORM\Table(name="pageweb", options={"comment":"pagewebs du site"})
 * @ORM\HasLifecycleCallbacks
 */
class pageweb extends item {

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
	 * @var boolean
	 * @ORM\Column(name="extended", type="boolean", nullable=false, unique=false)
	 */
	protected $extended;

	/**
	 * @var string
	 * @ORM\Column(name="title", type="string", length=100, nullable=true, unique=false)
	 */
	protected $title;

	/**
	 * @var string
	 * @ORM\Column(name="titreh1", type="string", length=255, nullable=true, unique=false)
	 */
	protected $titreh1;

	/**
	 * @var string
	 * @ORM\Column(name="metadescription", type="text", nullable=true, unique=false)
	 */
	protected $metadescription;

	/**
	 * @ORM\ManyToOne(targetEntity="site\adminsiteBundle\Entity\categorie")
	 * @ORM\JoinColumn(nullable=true, unique=false, onDelete="SET NULL")
	 */
	protected $diaporama;

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
	 * @var boolean
	 * @ORM\Column(name="messagebox", type="boolean", nullable=false, unique=false)
	 */
	protected $messagebox;


	public function __construct() {
		parent::__construct();
		$this->nom = null;
		$this->code = null;
		$this->extended = false;
		$this->title = null;
		$this->titreh1 = null;
		$this->metadescription = null;
		$this->modele = null;
		$this->diaporama = null;
		$this->subentitys = new ArrayCollection();
		$this->messagebox = true;
	}

	// public function getNestedAttributesParameters() {
	// 	$new = array(
	// 		'nesteds' => array(
	// 			'data-limit' => 0,
	// 			'class' => array('categorie'),
	// 			'required' => false,
	// 			),
	// 		);
	// 	return array_merge(parent::getNestedAttributesParameters(), $new);
	// }

	// /**
	//  * Renvoie l'image principale
	//  * @return image
	//  */
	// public function getMainMedia() {
	// 	return $this->getImage();
	// }

	/**
	 * Un élément par défaut dans la table est-il optionnel ?
	 * @return boolean
	 */
	public function isDefaultNullable() {
		return false;
	}

	/**
	 * Peut'on attribuer plusieurs éléments par défaut ?
	 * true 		= illimité
	 * integer 		= nombre max. d'éléments par défaut
	 * false, 0, 1 	= un seul élément
	 * @return boolean
	 */
	public function isDefaultMultiple() {
		return false;
	}

	/**
	 * Set code
	 * @param string $code
	 * @return pageweb
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
	 * Set extended
	 * @param boolean $extended
	 * @return pageweb
	 */
	public function setExtended($extended) {
		$this->extended = (boolean)$extended;
		return $this;
	}

	/**
	 * Get extended
	 * @return boolean 
	 */
	public function getExtended() {
		return $this->extended;
	}

	/**
	 * Set title
	 * @param string $title
	 * @return pageweb
	 */
	public function setTitle($title = null) {
		$this->title = $title;
		return $this;
	}

	/**
	 * Get title
	 * @return string 
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * Set titreh1
	 * @param string $titreh1
	 * @return pageweb
	 */
	public function setTitreh1($titreh1 = null) {
		$this->titreh1 = $titreh1;
		return $this;
	}

	/**
	 * Get titreh1
	 * @return string 
	 */
	public function getTitreh1() {
		return $this->titreh1;
	}

	/**
	 * Set metadescription
	 * @param string $metadescription
	 * @return pageweb
	 */
	public function setMetadescription($metadescription = null) {
		$this->metadescription = $metadescription;
		return $this;
	}

	/**
	 * Get metadescription
	 * @return string 
	 */
	public function getMetadescription() {
		return $this->metadescription;
	}

	/**
	 * set diaporama
	 * @param categorie $diaporama
	 * @return pageweb
	 */
	public function setDiaporama(categorie $diaporama = null) {
		$this->diaporama = $diaporama;
		return $this;
	}

	/**
	 * get diaporama
	 * @return categorie
	 */
	public function getDiaporama() {
		return $this->diaporama;
	}

	/**
	 * set subentitys
	 * @param ArrayCollection $subentitys
	 * @return pageweb
	 */
	public function setSubentitys(ArrayCollection $subentitys) {
		$this->subentitys = $subentitys;
		return $this;
	}

	/**
	 * add subentity
	 * @param subentity $subentity
	 * @return pageweb
	 */
	public function addSubentity(subentity $subentity) {
		if(!$this->subentitys->contains($subentity)) $this->subentitys->add($subentity);
		return $this;
	}

	/**
	 * remove subentity
	 * @param subentity $subentity
	 * @return pageweb
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
	 * Set modele
	 * @param string $modele
	 * @return pageweb
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
		return preg_replace("#\.html\.twig$#", '', end($path));
	}

	/**
	 * Get template
	 * @return string 
	 */
	public function getTemplate() {
		$path = preg_split('#(src/|Resources/|views/|/)#', $this->modele);
		return implode(array_slice($path, 0, -2)).':'.$path[count($path)-2].':'.$path[count($path)-1];
	}

	/**
	 * Get messagebox
	 * @return boolean
	 */
	public function getMessagebox() {
		return $this->messagebox;
	}

	/**
	 * Set messagebox
	 * @param boolean $messagebox
	 * @return pageweb
	 */
	public function setMessagebox($messagebox) {
		$this->messagebox = $messagebox;
		return $this;
	}










}