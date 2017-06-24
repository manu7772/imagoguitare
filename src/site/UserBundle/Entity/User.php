<?php
 
namespace site\UserBundle\Entity;

use Labo\Bundle\AdminBundle\Entity\LaboUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Yaml\Parser;
use Labo\Bundle\AdminBundle\services\aeData;
// JMS Serializer
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
// use JMS\Serializer\Annotation\MaxDepth;
use JMS\Serializer\Annotation\Groups;

use \DateTime;
use \Exception;
use \ReflectionClass;

/**
 * @ORM\Entity(repositoryClass="site\UserBundle\Entity\UserRepository")
 * @ORM\Table(name="User")
 * 
 * @ORM\HasLifecycleCallbacks
 * @ExclusionPolicy("all")
 */
class User extends LaboUser {

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @Expose
	 * @Groups({"complete", "ajaxlive", "facture"})
	 */
	protected $id;

	/**
	 * @var string
	 * @ORM\Column(name="nom", type="string", length=50, nullable=true, unique=false)
	 * @Assert\NotNull(message="Vous devez préciser votre nom.")
	 * @Expose
	 * @Groups({"complete", "facture"})
	 */
	protected $nom;


	public function __construct() {
		parent::__construct();
	}

	public function getStatutsocials() {
		return array(
			0 => 'statutsocial.actif',
			1 => 'statutsocial.demandeurdemploi',
			2 => 'statutsocial.etudiant',
			// 3 => 'statutsocial.enfant',
			// 4 => 'statutsocial.retraite',
		);
	}

	public function getSexes() {
		return array(
			0 => 'sexe.femme',
			1 => 'sexe.homme',
			// 2 => 'autre',
		);
	}

	// public function getUniontypes() {
	// 	return array(
	// 		0 => 'union.aucun',
	// 		1 => 'union.conjoint',
	// 		2 => 'union.concubin',
	// 		3 => 'union.autre',
	// 	);
	// }

}