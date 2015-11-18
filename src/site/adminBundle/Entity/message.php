<?php

namespace site\adminBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use site\adminBundle\Entity\statut;

use \DateTime;

/**
 * message
 *
 * @ORM\Table(name="message")
 * @ORM\Entity(repositoryClass="site\adminBundle\Entity\messageRepository")
 */
class message {

    /**
     * @var integer
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(name="nom", type="string", length=255, nullable=true, unique=false)
     * @Assert\Length(
     *      min = "3",
     *      minMessage = "Le nom doit comporter au moins {{ limit }} lettres.",
     * )
     */
    private $nom;

    /**
     * @var string
     * @ORM\Column(name="email", type="string", nullable=false, unique=false)
     */
    private $email;

    /**
     * @var string
     * @ORM\Column(name="objet", type="string", length=255, nullable=true, unique=false)
     */
    private $objet;

    /**
     * @var string
     * @ORM\Column(name="message", type="text", nullable=false, unique=false)
     * @Assert\NotBlank(message = "entity.notblank.nom")
     * @Assert\Length(
     *      min = "3",
     *      minMessage = "Le message doit comporter au moins {{ limit }} lettres.",
     * )
     */
    private $message;

    /**
     * @var DateTime
     * @ORM\Column(name="creation", type="datetime", nullable=false, unique=false)
     */
    private $creation;

    /**
     * @var string
     * @ORM\Column(name="ip", type="string", length=32, nullable=true, unique=false)
     */
    private $ip;

    /**
     * @ORM\ManyToOne(targetEntity="statut")
     * @ORM\JoinColumn(referencedColumnName="id", nullable=false, unique=false)
     */
    protected $statut;


    public function __construct() {
        $this->creation = new DateTime();
    }


    /**
     * Get id
     * @return integer
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Set nom
     * @param string $nom
     * @return message
     */
    public function setNom($nom) {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     * @return string
     */
    public function getNom() {
        return $this->nom;
    }

    /**
     * Set email
     * @param string $email
     * @return message
     */
    public function setEmail($email) {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     * @return string
     */
    public function getEmail() {
        return $this->email;
    }

    /**
     * Set objet
     * @param string $objet
     * @return message
     */
    public function setObjet($objet) {
        $this->objet = $objet;

        return $this;
    }

    /**
     * Get objet
     * @return string
     */
    public function getObjet() {
        return $this->objet;
    }

    /**
     * Set message
     * @param string $message
     * @return message
     */
    public function setMessage($message) {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     * @return string
     */
    public function getMessage() {
        return $this->message;
    }

    /**
     * Set creation
     * @param DateTime $creation
     * @return message
     */
    public function setCreation($creation) {
        $this->creation = $creation;

        return $this;
    }

    /**
     * Get creation
     * @return DateTime
     */
    public function getCreation() {
        return $this->creation;
    }

    /**
     * Set ip
     * @param string $ip
     * @return message
     */
    public function setIp($ip) {
        $this->ip = $ip;

        return $this;
    }

    /**
     * Get ip
     * @return string
     */
    public function getIp() {
        return $this->ip;
    }

    /**
     * Set statut
     * @param statut $statut
     * @return article
     */
    public function setStatut(statut $statut) {
        $this->statut = $statut;
    
        return $this;
    }

    /**
     * Get statut
     * @return statut 
     */
    public function getStatut() {
        return $this->statut;
    }


}

