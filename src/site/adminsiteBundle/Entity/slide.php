<?php

namespace site\adminsiteBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;
// JMS Serializer
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\MaxDepth;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\Accessor;

use Labo\Bundle\AdminBundle\Entity\item;

use \Exception;

/**
 * slide
 *
 * @ExclusionPolicy("all")
 *
 * @ORM\Entity(repositoryClass="site\adminsiteBundle\Entity\slideRepository")
 * @ORM\Table(name="slide", options={"comment":"slides du site"})
 * @ORM\HasLifecycleCallbacks
 */
class slide extends item {

	/**
	 * @var integer
	 * @ORM\Id
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @var string
	 * @ORM\Column(name="titre", type="string", length=30, nullable=true, unique=false)
	 * @Assert\Length(
	 *      max = "30",
	 *      maxMessage = "Le titre doit comporter au maximum {{ limit }} lettres."
	 * )
	 */
	protected $titre;

	/**
	 * @var float
	 * @ORM\Column(name="delay", type="float", nullable=false, unique=false)
	 */
	protected $delay;

	/**
	 * @var boolean
	 * @ORM\Column(name="overlay", type="boolean", nullable=false, unique=false)
	 */
	protected $overlay;

	/**
	 * @var boolean
	 * @ORM\Column(name="autoplayvideo", type="boolean", nullable=false, unique=false)
	 */
	protected $autoplayvideo;

	/**
	 * @var boolean
	 * @ORM\Column(name="lightext", type="boolean", nullable=false, unique=false)
	 */
	protected $lightext;

	/**
	 * @var string
	 * @ORM\Column(name="youtube", type="string", length=30, nullable=true, unique=false)
	 * @Assert\Length(
	 *      max = "30",
	 *      maxMessage = "Le code Youtube doit comporter au maximum {{ limit }} lettres."
	 * )
	 */
	protected $youtube;

	/**
	 * @var string
	 * @ORM\Column(name="accroche", type="text", nullable=true, unique=false)
	 * @Assert\Length(
	 *      max = "600",
	 *      maxMessage = "L'accroche doit comporter au maximum {{ limit }} lettres."
	 * )
	 */
	protected $accroche;

    /**
     * @ORM\OneToOne(targetEntity="site\adminsiteBundle\Entity\image", orphanRemoval=true, cascade={"persist","remove"})
	 * @ORM\JoinColumn(nullable=false, unique=true, onDelete="SET NULL")
     */
    protected $image;

    /**
     * @ORM\ManyToOne(targetEntity="Labo\Bundle\AdminBundle\Entity\item")
	 * @ORM\JoinColumn(nullable=true, unique=false, onDelete="SET NULL")
     */
    protected $item;

	/**
	 * @var string
	 * @ORM\Column(name="transition", type="string", length=64, nullable=false, unique=false)
	 */
	protected $transition;
	protected $transitions;

	public function __construct() {
		parent::__construct();
		$this->titre = null;
		$this->accroche = null;
		$this->delay = 5000;
		$this->overlay = false;
		$this->autoplayvideo = false;
		$this->lightext = false;
		$this->youtube = null;
		$this->item = null;
		$this->setDefaultTransition();
	}

	public function getTransitions() {
		return array(
			'boxslide'					=> 'boxslide',
			'boxfade'					=> 'boxfade',
			'slotslide-horizontal'		=> 'slotslide-horizontal',
			'slotslide-vertical'		=> 'slotslide-vertical',
			'curtain-1'					=> 'curtain-1',
			'curtain-2'					=> 'curtain-2',
			'curtain-3'					=> 'curtain-3',
			'slotzoom-horizontal'		=> 'slotzoom-horizontal',
			'slotzoom-vertical'			=> 'slotzoom-vertical',
			'slotfade-horizontal'		=> 'slotfade-horizontal',
			'slotfade-vertical'			=> 'slotfade-vertical',
			'fade'						=> 'fade',
			'crossfade'					=> 'crossfade',
			'fadethroughdark'			=> 'fadethroughdark',
			'fadethroughlight'			=> 'fadethroughlight',
			'fadethroughtransparent'	=> 'fadethroughtransparent',
			'slideleft'					=> 'slideleft',
			'slideup'					=> 'slideup',
			'slidedown'					=> 'slidedown',
			'slideright'				=> 'slideright',
			'slideoverleft'				=> 'slideoverleft',
			'slideoverup'				=> 'slideoverup',
			'slideoverdown'				=> 'slideoverdown',
			'slideoverright'			=> 'slideoverright',
			'slideremoveleft'			=> 'slideremoveleft',
			'slideremoveup'				=> 'slideremoveup',
			'slideremovedown'			=> 'slideremovedown',
			'slideremoveright'			=> 'slideremoveright',
			'papercut'					=> 'papercut',
			'3dcurtain-horizontal'		=> '3dcurtain-horizontal',
			'3dcurtain-vertical'		=> '3dcurtain-vertical',
			'cubic'						=> 'cubic',
			'cube'						=> 'cube',
			'flyin'						=> 'flyin',
			'turnoff'					=> 'turnoff',
			'incube'					=> 'incube',
			'cubic-horizontal'			=> 'cubic-horizontal',
			'cube-horizontal'			=> 'cube-horizontal',
			'incube-horizontal'			=> 'incube-horizontal',
			'turnoff-vertical'			=> 'turnoff-vertical',
			'fadefromright'				=> 'fadefromright',
			'fadefromleft'				=> 'fadefromleft',
			'fadefromtop'				=> 'fadefromtop',
			'fadefrombottom'			=> 'fadefrombottom',
			'fadetoleftfadefromright'	=> 'fadetoleftfadefromright',
			'fadetorightfadefromleft'	=> 'fadetorightfadefromleft',
			'fadetobottomfadefromtop'	=> 'fadetobottomfadefromtop',
			'fadetotopfadefrombottom'	=> 'fadetotopfadefrombottom',
			'parallaxtoright'			=> 'parallaxtoright',
			'parallaxtoleft'			=> 'parallaxtoleft',
			'parallaxtotop'				=> 'parallaxtotop',
			'parallaxtobottom'			=> 'parallaxtobottom',
			'scaledownfromright'		=> 'scaledownfromright',
			'scaledownfromleft'			=> 'scaledownfromleft',
			'scaledownfromtop'			=> 'scaledownfromtop',
			'scaledownfrombottom'		=> 'scaledownfrombottom',
			'zoomout'					=> 'zoomout',
			'zoomin'					=> 'zoomin',
			'slidingoverlayup'			=> 'slidingoverlayup',
			'slidingoverlaydown'		=> 'slidingoverlaydown',
			'slidingoverlayright'		=> 'slidingoverlayright',
			'slidingoverlayleft'		=> 'slidingoverlayleft',
			'parallaxcirclesup'			=> 'parallaxcirclesup',
			'parallaxcirclesdown'		=> 'parallaxcirclesdown',
			'parallaxcirclesright'		=> 'parallaxcirclesright',
			'parallaxcirclesleft'		=> 'parallaxcirclesleft',
			'notransition'				=> 'notransition',
			'parallaxright'				=> 'parallaxright',
			'parallaxleft'				=> 'parallaxleft',
			'parallaxup'				=> 'parallaxup',
			'parallaxdown'				=> 'parallaxdown',
			);
	}
	public function getDefaultTransition() {
		$keys = array_keys($this->getTransitions());
		return reset($keys);
	}

	public function setDefaultTransition() {
		$this->setTransition($this->getDefaultTransition());
	}
	public function setTransition($transition) {
		if(!array_key_exists($transition, $this->getTransitions())) throw new Exception("Slide type ".json_encode($transition)." does not exist!", 1);
		$this->transition = $transition;
		return $this;
	}

	public function getTransition() {
		return $this->transition;
	}
	public function getTransitionname() {
		return $this->getTransitions()[$this->transition];
	}

	/**
	 * Set titre
	 * @param string $titre
	 * @return slide
	 */
	public function setTitre($titre = null) {
		if($titre != null)
			$this->titre = strlen(trim($titre)) < 1 ? null : trim($titre);
			else $this->titre = null;
		return $this;
	}

	/**
	 * Get titre
	 * @return string 
	 */
	public function getTitre() {
		return $this->titre;
	}

	/**
	 * Set youtube
	 * @param string $youtube
	 * @return slide
	 */
	public function setYoutube($youtube = null) {
		if($youtube != null) {
			$this->youtube = strlen(trim($youtube)) < 1 ? null : trim($youtube);
			$exp = explode('/', $this->youtube);
			if(count($exp) > 1) $this->youtube = end($exp);
		} else {
			$this->youtube = null;
		}
		if($this->youtube === null) $this->setAutoplayvideo(false);
		return $this;
	}

	/**
	 * Get youtube
	 * @return string 
	 */
	public function getYoutube() {
		return $this->youtube;
	}

	/**
	 * Set accroche
	 * @param string $accroche
	 * @return slide
	 */
	public function setAccroche($accroche = null) {
		if($accroche != null)
			$this->accroche = strlen(trim(strip_tags($accroche))) < 1 ? null : trim($accroche);
			else $this->accroche = null;
		return $this;
	}

	/**
	 * Get accroche
	 * @return string 
	 */
	public function getAccroche() {
		return $this->accroche;
	}

	/**
	 * Set item
	 * @param item $item
	 * @return slide
	 */
	public function setItem(item $item = null) {
		$this->item = $item;
		return $this;
	}

	/**
	 * Get item
	 * @return item 
	 */
	public function getItem() {
		return $this->item;
	}

	/**
	 * Set delay
	 * @param float $delay
	 * @return slide
	 */
	public function setDelay($delay) {
		$this->delay = (float) str_replace(',', '.', $delay);
		if($this->delay < 1) $this->delay = 1;
	}

	/**
	 * Get delay
	 * @return float
	 */
	public function getDelay() {
		return $this->delay;
	}

	/**
	 * Set overlay
	 * @param boolean $overlay
	 * @return slide
	 */
	public function setOverlay($overlay) {
		$this->overlay = (boolean) $overlay;
		return $this;
	}

	/**
	 * Get overlay
	 * @return boolean
	 */
	public function getOverlay() {
		return $this->overlay;
	}

	/**
	 * Set autoplayvideo
	 * @param boolean $autoplayvideo
	 * @return slide
	 */
	public function setAutoplayvideo($autoplayvideo) {
		$this->autoplayvideo = (boolean) $autoplayvideo;
		return $this;
	}

	/**
	 * Get autoplayvideo
	 * @return boolean
	 */
	public function getAutoplayvideo() {
		return $this->autoplayvideo;
	}

	/**
	 * Set lightext
	 * @param boolean $lightext
	 * @return slide
	 */
	public function setLightext($lightext) {
		$this->lightext = (boolean) $lightext;
		return $this;
	}

	/**
	 * Get lightext
	 * @return boolean
	 */
	public function getLightext() {
		return $this->lightext;
	}










}
