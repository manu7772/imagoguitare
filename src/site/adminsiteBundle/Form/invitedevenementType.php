<?php

namespace site\adminsiteBundle\Form;

// use Labo\Bundle\AdminBundle\Form\baseuserevenementType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\ChoiceList\ChoiceList;
use FOS\UserBundle\Util\LegacyFormHelper;
use Symfony\Component\DependencyInjection\Container;

// Paramétrage de formulaire
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

use Labo\Bundle\AdminBundle\services\aeData;
use site\UserBundle\Entity\User;
use site\UserBundle\Entity\TempUser;
use Labo\Bundle\AdminBundle\Entity\LaboUser;
use Labo\Bundle\AdminBundle\Entity\LaboUserRepository;
// use site\adminsiteBundle\Entity\userevenement;
use Labo\Bundle\AdminBundle\Entity\baseevenement;
use Labo\Bundle\AdminBundle\Entity\invitedevenement;
use Labo\Bundle\AdminBundle\Entity\baseuserevenement;

class modelUser extends TempUser {};

class invitedevenementType extends AbstractType {

    // protected $controller;

    // public function __construct($controller) {
    //     $this->controller = $controller;
    // }

	/**
	 * @param FormBuilderInterface $builder
	 * @param array $options
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
        // parent::buildForm($builder, $options);

        $user = new modelUser();
        $invitedevenement = $builder->getData();
        if($invitedevenement !== null) {
            $evenement = $invitedevenement->getEvenement();
            $user = $invitedevenement->getUser();
            $hostUser = $evenement->getUser();
        }

		// Builder…
		$builder
			->add('email', LegacyFormHelper::getType('Symfony\Component\Form\Extension\Core\Type\EmailType'), array(
				'label'     => 'fields.email',
				'translation_domain' => 'siteUserBundle',
				'required'  => true,
				'attr' => array(
					'class' => 'input-sm live_verif',
					'placeholder'   => 'fields.email',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					),
				))
			->add('user', 'hidden')
			->add('nom', 'text', array(
				'label' => 'fields.nom',
				'translation_domain' => 'siteUserBundle',
				'required' => true,
				'attr' => array(
					'class' => 'input-sm live_verif',
					'placeholder'   => 'fields.nom',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					),
				'disabled' => true,
				))
			->add('prenom', 'text', array(
				'label' => 'fields.prenom',
				'translation_domain' => 'siteUserBundle',
				'required' => false,
				'attr' => array(
					'class' => 'input-sm live_verif',
					'placeholder'   => 'fields.prenom',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					),
				'disabled' => true,
				))
			->add('statutsocial', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"label" => "fields.statutsocial",
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"choice_list" => new ChoiceList(
					array_keys($user->getStatutsocials()),
					array_values($user->getStatutsocials())
					),
				'attr' => array(
					'class' => 'live_verif',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					// 'placeholder' => 'fields.select',
					),
				'disabled' => true,
				))
			->add('uniontype', 'choice', array(
				'translation_domain' => 'siteUserBundle',
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"disabled" => false,
				"label" => "fields.relation",
				"choice_list" => new ChoiceList(
					array_keys($user->getUniontypes()),
					array_values($user->getUniontypes())
					),
				'attr' => array(
					'class' => 'live_verif',
					'placeholder' => 'fields.select',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					),
				))
			->add('sendemail', 'choice', array(
				'translation_domain' => 'invitedevenement',
				"label" => "fields.sendemail",
				"required" => true,
				"expanded" => false,
				"multiple" => false,
				"choice_list" => new ChoiceList(
					array(false,true),
					array('choices.non','choices.oui')
					),
				'attr' => array(
					'class' => 'live_verif',
					'placeholder' => 'fields.select',
					'style' => 'width:90%;',
					'autocomplete'  => 'off',
					),
				))			
		;

		$builder->addEventListener(
			FormEvents::PRE_SET_DATA, function (FormEvent $event) {
				$baseuserevenement = $event->getData();
				$form = $event->getForm();
				// à conserver !! ci-dessous
				if(null === $baseuserevenement) {
					$form->remove('user');
					return;
				}

				$user = $baseuserevenement->getUser();
				$isUser = $user instanceOf User;
				// if($isUser) $isUser = $isUser && $user->isEnabled();
				$isUserunioneditable = $baseuserevenement->isUserunioneditable();

				$form
					->add('email', LegacyFormHelper::getType('Symfony\Component\Form\Extension\Core\Type\EmailType'), array(
						'label'     => 'fields.email',
						'translation_domain' => 'siteUserBundle',
						'required'  => true,
						'attr' => array(
							'class' => 'input-sm live_verif',
							'placeholder'   => 'fields.email',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							),
						))
					;

				if($isUser) {
					$form
						->add('user', 'entity', array(
							'label' => 'fields.userfound',
							'class' => 'site\UserBundle\Entity\User',
							'translation_domain' => 'siteUserBundle',
							'required' => true,
							'multiple' => false,
							'expanded' => false,
							'attr' => array(
								'placeholder'   => 'fields.user',
								'style' => 'width:90%;',
								'autocomplete'  => 'off',
								),
							'disabled' => true,
							'query_builder' => function(LaboUserRepository $repo) use ($user) {
									return $repo->getQueryWithUserId($user->getId());
								}
							))
						;
				} else {
					$form
						->remove('user')
						;
				}

				$form
					->add('nom', 'text', array(
						'label' => 'fields.nom',
						'translation_domain' => 'siteUserBundle',
						'required' => true,
						'attr' => array(
							'class' => 'input-sm live_verif',
							'placeholder'   => 'fields.nom',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							),
						'disabled' => $isUser,
						))
					->add('prenom', 'text', array(
						'label' => 'fields.prenom',
						'translation_domain' => 'siteUserBundle',
						'required' => false,
						'attr' => array(
							'class' => 'input-sm live_verif',
							'placeholder'   => 'fields.prenom',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							),
						'disabled' => $isUser,
						))
					->add('statutsocial', 'choice', array(
						'translation_domain' => 'siteUserBundle',
						"label" => "fields.statutsocial",
						"required" => true,
						"expanded" => false,
						"multiple" => false,
						"choice_list" => new ChoiceList(
							array_keys($user->getStatutsocials()),
							array_values($user->getStatutsocials())
							),
						'attr' => array(
							'class' => 'live_verif',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							// 'placeholder' => 'fields.select',
							),
						'disabled' => $isUser,
						))
					->add('uniontype', 'choice', array(
						'translation_domain' => 'siteUserBundle',
						"required" => true,
						"expanded" => false,
						"multiple" => false,
						"disabled" => !$baseuserevenement->isUserunioneditable(),
						"label" => "fields.relation",
						"choice_list" => new ChoiceList(
							array_keys($user->getUniontypes()),
							array_values($user->getUniontypes())
							),
						'attr' => array(
							'class' => 'live_verif',
							'placeholder' => 'fields.select',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							),
						))
					->add('sendemail', 'choice', array(
						'translation_domain' => 'invitedevenement',
						"label" => "fields.sendemail",
						"required" => true,
						"expanded" => false,
						"multiple" => false,
						"choice_list" => new ChoiceList(
							array(false,true),
							array('choices.non','choices.oui')
							),
						'attr' => array(
							'class' => 'live_verif',
							'placeholder' => 'fields.select',
							'style' => 'width:90%;',
							'autocomplete'  => 'off',
							),
						))
					;

				if($isUserunioneditable) {
					// $form->remove('statutsocial');
					// $form->remove('uniontype');
				}
				if(!$user->isEnabled()) {
					$form->remove('nom');
					$form->remove('prenom');
					$form->remove('statutsocial');
					$form->remove('uniontype');
					$form->remove('sendemail');
				}

			}
		);



	}

	public function configureOptions(OptionsResolver $resolver) {
		$resolver->setDefaults(array(
			'data_class' => 'Labo\Bundle\AdminBundle\Entity\invitedevenement',
			'label' => 'Invité',
		));
	}

	/**
	 * @return string
	 */
	public function getName() {
		return 'site_adminsitebundle_invitedevenement';
	}
}
