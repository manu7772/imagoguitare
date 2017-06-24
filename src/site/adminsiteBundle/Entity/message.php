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

use Labo\Bundle\AdminBundle\Entity\message as baseMessage;
use Labo\Bundle\AdminBundle\Entity\messageuser;

/**
 * message
 *
 * @ExclusionPolicy("all")
 *
 * @ORM\Entity(repositoryClass="site\adminsiteBundle\Entity\messageRepository")
 * @ORM\Table(name="message", options={"comment":"messages du site"})
 * @ORM\HasLifecycleCallbacks
 */
class message extends baseMessage {

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	protected $id;

	/**
	 * @var boolean
	 * @ORM\Column(name="connected", type="boolean", nullable=false, unique=false)
	 */
	protected $connected;

	/**
	 * - INVERSE
	 * @ORM\OneToMany(targetEntity="Labo\Bundle\AdminBundle\Entity\messageuser", mappedBy="messageuser", cascade={"persist", "remove"})
	 * @ORM\JoinColumn(nullable=true, unique=true, onDelete="SET NULL")
	 * @Expose
	 * @Groups({"complete", "ajaxlive"})
	 * @MaxDepth(1)
	 */
	protected $collaborators;

	public function __construct() {
		parent::__construct();
		$this->collaborators = new ArrayCollection();
		$this->connected = true;
	}

	public function getId() {
		return $this->id;
	}

	public function setConnected($connected) {
		$this->connected = $connected;
		return $this;
	}
	public function getConnected() {
		return $this->connected;
	}

	/**
	 * Set collaborators
	 * @param ArrayCollection $collaborators
	 * @return message
	 */
	public function setCollaborators(ArrayCollection $collaborators) {
		$this->collaborators = $collaborators;
		return $this;
	}

	/**
	 * Add collaborator
	 * @param messageuser $collaborator
	 * @return message
	 */
	public function addCollaborator(messageuser $collaborator) {
		$this->collaborators->add($collaborator);
		return $this;
	}

	/**
	 * Remove collaborator
	 * @param messageuser $collaborator
	 * @return boolean
	 */
	public function removeCollaborator(messageuser $collaborator) {
		return $this->collaborators->RemoveElement($collaborator);
	}


}