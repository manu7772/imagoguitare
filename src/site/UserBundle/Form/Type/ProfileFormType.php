<?php
// src/site/UserBundle/Form/Type/ProfileFormType.php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace site\UserBundle\Form\Type;

use FOS\UserBundle\Form\Type\ProfileFormType as BaseType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Validator\Constraint\UserPassword as OldUserPassword;
use Symfony\Component\Security\Core\Validator\Constraints\UserPassword;
use Symfony\Component\Form\Extension\Core\ChoiceList\ChoiceList;
use FOS\UserBundle\Util\LegacyFormHelper;

// Paramétrage de formulaire
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

use site\UserBundle\Entity\User;
use Labo\Bundle\AdminBundle\Entity\LaboUser;
use Labo\Bundle\AdminBundle\Form\imageType;
use site\adminsiteBundle\Form\cropperType;
use site\adminsiteBundle\Form\userAdresseType;

class ProfileFormType extends BaseType {

	protected $class;
	protected $user;

	/**
	 * @param string $class The User class name
	 */
	public function __construct($class, User $user = null) {
		parent::__construct($class);
		$this->class = $class;
		$this->user = $user;
	}

	public function buildForm(FormBuilderInterface $builder, array $options) {
		// if (class_exists('Symfony\Component\Security\Core\Validator\Constraints\UserPassword')) {
		//     $constraint = new UserPassword();
		// } else {
		//     // Symfony 2.1 support with the old constraint class
		//     $constraint = new OldUserPassword();
		// }

		$this->buildUserForm($builder, $options);
		$this->imagesData = array(
			'image' => array(
				'owner' => 'User:avatar'
				),
			)
		;

		$entity = new User();
		// $themesList = array_values($entity->getAdminskins());
		// $themesListKeys = array_keys($entity->getAdminskins());

		$builder
			->add('username', null, array(
				'label' => 'form.username',
				'translation_domain' => 'FOSUserBundle',
				'attr' => array(
					'class' => 'input-sm form-control',
					'placeholder'   => 'Nom utilisateur',
					),
				))
			->add('email', LegacyFormHelper::getType('Symfony\Component\Form\Extension\Core\Type\EmailType'), array(
				'label' => 'form.email',
				'translation_domain' => 'FOSUserBundle',
				'attr' => array(
					'class' => 'input-sm form-control',
					'placeholder'   => 'Email',
					),
				))
			// ->add('current_password', 'password', array(
			//     'label' => 'form.current_password',
			//     'translation_domain' => 'FOSUserBundle',
			//     'mapped' => false,
			//     'constraints' => $constraint,
			//     ))
			->add('nom', 'text', array(
				'translation_domain' => 'siteUserBundle',
				'label'     => 'fields.nom',
				'label_attr' => array('class' => 'text-muted'),
				'required'  => false,
				'attr' => array(
					'class' => 'input-sm form-control',
					'placeholder'   => 'fields.nom',
					),
				))
			->add('prenom', 'text', array(
				'translation_domain' => 'siteUserBundle',
				'label'     => 'fields.prenom',
				'label_attr' => array('class' => 'text-muted'),
				'required'  => false,
				'attr' => array(
					'class' => 'input-sm form-control',
					'placeholder'   => 'fields.prenom',
					),
				))
			->add('telephone', 'text', array(
				'translation_domain' => 'siteUserBundle',
				'label'     => 'fields.telephone',
				'label_attr' => array('class' => 'text-muted'),
				'required'  => false,
				'attr' => array(
					'class' => 'input-sm form-control',
					'placeholder' => 'fields.telephone',
					),
				))
            ->add('profession', 'text', array(
                'translation_domain' => 'siteUserBundle',
                'label'     => 'fields.profession',
                'label_attr' => array('class' => 'text-muted'),
                'required'  => false,
                'attr' => array(
                    'class' => 'input-sm form-control',
                    'placeholder'   => 'fields.profession',
                    ),
                ))
			->add('cookies', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"label" => "fields.cookies",
				"choice_list" => new ChoiceList(
					array(true, false),
					array('J\'accepte les cookies', 'Je n\'accepte pas les cookies')
					),
				'attr' => array(
					'class' => 'form-full',
					'placeholder' => 'form.select',
					),
				))
			->add('publicite', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"label" => "fields.publicite",
				"choice_list" => new ChoiceList(
					array(true, false),
					array('J\'accepte les mails provenant du site', 'Je n\'accepte pas les mails provenant du site')
					),
				'attr' => array(
					'class' => 'form-full',
					'placeholder' => 'form.select',
					),
				))
			->add('sexe', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"label" => "fields.sexe",
				// 'label_attr' => array('class' => 'text-muted'),
				"choice_list" => new ChoiceList(
					array_keys($entity->getSexes()),
					array_values($entity->getSexes())
					),
				'attr' => array(
					'class' => 'form-full',
					'placeholder' => 'form.select',
					),
				))
			->add('statutsocial', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"label" => "fields.statutsocial",
				// 'label_attr' => array('class' => 'text-muted'),
				"choice_list" => new ChoiceList(
					array_keys($entity->getStatutsocials()),
					array_values($entity->getStatutsocials())
					),
				'attr' => array(
					'class' => 'form-full',
					'placeholder' => 'form.select',
					),
				))
			// ->add('userunion', 'entity', array(
			// 	'translation_domain' => 'siteUserBundle',
			// 	"required" => false,
			// 	"expanded" => false,
			// 	"multiple" => false,
			// 	"label" => "fields.userunion",
			// 	'attr' => array(
			// 		'class' => 'form-full',
			// 		'placeholder' => 'form.select',
			// 		),
			// 	'class' => 'Labo\\Bundle\\AdminBundle\\Entity\\LaboUser',
			// 	'choice_label' => 'email',
			// 	))
			// ->add('uniontype', 'choice', array(
			// 	'translation_domain' => 'siteUserBundle',
			// 	"required" => true,
			// 	"expanded" => false,
			// 	"multiple" => false,
			// 	"label" => "fields.uniontype",
			// 	// 'label_attr' => array('class' => 'text-muted'),
			// 	"choice_list" => new ChoiceList(
			// 		array_keys($entity->getUniontypes()),
			// 		array_values($entity->getUniontypes())
			// 		),
			// 	'attr' => array(
			// 		'class' => 'form-full',
			// 		'placeholder' => 'form.select',
			// 		),
			// 	))
			// ->add('langue', 'text', array(
			// 	'translation_domain' => 'siteUserBundle',
			// 	"required" => true,
			// 	"label" => "fields.lang",
			// 	'label_attr' => array('class' => 'text-muted'),
			// 	'attr' => array(
			// 		'class' => 'input-sm form-control',
			// 		),
			// 	))
			// ->add('avatar', new cropperType(null, array('image' => $this->imagesData['image'])), array(
			// 	'translation_domain' => 'siteUserBundle',
			// 	'label' => 'fields.avatar',
			// 	'required' => false,
			// 	))
			->add('adresse', new userAdresseType(), array(
				'label' => 'Adresse',
				'required' => false,
				))
			// ->add('adresseLivraison', new userAdresseType(), array(
			// 	'label' => 'Adresse de livraison',
			// 	'required' => false,
			// 	))
		;

		$builder->addEventListener(
			FormEvents::PRE_SET_DATA, function(FormEvent $event) use ($options) {
				$user = $event->getData();
				$form = $event->getForm();

				if(is_object($user)) {
					$roles = $user->getRoles();
					$validRoles = array("ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_TRANSLATOR");
					if(count(array_intersect($roles, $validRoles)) > 0) {
						$form
							->add('adminhelp', 'insCheck', array(
								'translation_domain' => 'siteUserBundle',
								"required" => false,
								"label" => "fields.help",
								'label_attr' => array('class' => 'text-muted'),
								'attr' => array(
									'class' => 'input-sm form-control',
									),
								))
							->add('mail_sitemessages', 'insCheck', array(
								'translation_domain' => 'siteUserBundle',
								"required" => false,
								"label" => "fields.mail_sitemessages",
								'label_attr' => array('class' => 'text-muted'),
								'attr' => array(
									'class' => 'input-sm form-control',
									),
								))
							->add('admintheme', 'choice', array(
								'translation_domain' => 'siteUserBundle',
								"required" => true,
								"label" => "fields.theme",
								'label_attr' => array('class' => 'text-muted'),
								"choice_list" => new ChoiceList(
									array_keys($user->getAdminskins()),
									array_values($user->getAdminskins())
									),
								'attr' => array(
									'class' => 'input-sm form-control chosen-select chosen-select-width chosen-select-no-results',
									'placeholder' => 'form.select',
									),
								))
						;
					}
					if(isset($options['editor'])) {
						$validRoles = array("ROLE_SUPER_ADMIN");
						if(count(array_intersect($options['editor']->getRoles(), $validRoles)) > 0) {
							$form
								->add('userunion', 'entity', array(
									'translation_domain' => 'siteUserBundle',
									"required" => false,
									"expanded" => false,
									"multiple" => false,
									"label" => "fields.userunion",
									'attr' => array(
										'class' => 'form-full',
										'placeholder' => 'form.select',
										),
									'class' => 'Labo\\Bundle\\AdminBundle\\Entity\\LaboUser',
									// 'choice_label' => 'email',
									'choice_label' => 'username',
									))
								->add('uniontype', 'choice', array(
									'translation_domain' => 'siteUserBundle',
									"required" => true,
									"expanded" => false,
									"multiple" => false,
									"label" => "fields.uniontype",
									// 'label_attr' => array('class' => 'text-muted'),
									"choice_list" => new ChoiceList(
										array_keys($user->getUniontypes()),
										array_values($user->getUniontypes())
										),
									'attr' => array(
										'class' => 'form-full',
										'placeholder' => 'form.select',
										),
									))
							;
						}
					}

				}
			}
		);

		// $builder->add('submit', 'submit', array(
		// 	'label' => 'form.enregistrer',
		// 	'translation_domain' => 'messages',
		// 	'attr' => array(
		// 		'class' => "btn btn-md btn-block btn-info",
		// 		),
		// 	))
		// ;


	}

	public function configureOptions(OptionsResolver $resolver) {
		$resolver->setDefaults(array(
			'data_class' => 'site\UserBundle\Entity\User',
			'intention'  => 'profile',
			'attr'		 => array(
				'class' => 'form-horizontal',
				)
		));
		$resolver->setDefined('editor');
	}

	public function getName()
	{
		return 'site_user_profile';
	}

	/**
	 * Builds the embedded form representing the user.
	 *
	 * @param FormBuilderInterface $builder
	 * @param array                $options
	 */
	protected function buildUserForm(FormBuilderInterface $builder, array $options) {
		$builder
			->add('username', null, array(
				'label' => 'form.username',
				'label_attr' => array('class' => 'text-muted'),
				'translation_domain' => 'siteUserBundle',
				'attr' => array(
					'class' => 'input-sm form-control',
					),
				))
			->add('email', 'email', array(
				'label' => 'form.email',
				'label_attr' => array('class' => 'text-muted'),
				'translation_domain' => 'siteUserBundle',
				'attr' => array(
					'class' => 'input-sm form-control',
					),
				))
		;
	}
}


