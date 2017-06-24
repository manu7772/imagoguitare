<?php
namespace site\adminsiteBundle\Form;

// use Labo\Bundle\AdminBundle\Form\baseuserevenementType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
// use Symfony\Component\Form\Extension\Core\ChoiceList\ChoiceList;
use FOS\UserBundle\Util\LegacyFormHelper;

// Paramétrage de formulaire
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

use Labo\Bundle\AdminBundle\Entity\baseevenement;
use Labo\Bundle\AdminBundle\Entity\userevenement;
use Labo\Bundle\AdminBundle\Entity\invitedevenement;
use site\adminsiteBundle\Form\invitedevenementType;
use site\UserBundle\Form\Type\ProfileForUserevenementType;
use site\UserBundle\Form\Type\RegistrationForUserevenementType;
use Labo\Bundle\AdminBundle\Entity\baseuserevenement;

use site\UserBundle\Entity\User;
use site\UserBundle\Entity\TempUser;
use Labo\Bundle\AdminBundle\Entity\LaboUser;

use \Exception;

class userevenementType extends AbstractType {

	protected function compilesTools(userevenement $userevenement, $options) {
		$data['UserClass'] = 'Labo\Bundle\AdminBundle\Entity\LaboUser';
		$data['UserManager'] = null;
		if(isset($options['controller'])) {
			$controller = $options['controller'];
			$data['UserManager'] = $controller->get('fos_user.user_manager');
			$data['UserClass'] = $data['UserManager']->getClass();
		}
		$data['evenement'] = $userevenement->getEvenement();
		$data['user'] = $userevenement->getUser();
		$data['evenement'] = $data['evenement'] instanceOf baseevenement ? $data['evenement'] : $options['evenement'];
		$data['user'] = $data['user'] instanceOf $data['UserClass'] ? $data['user'] : $options['user'];
		if(!($data['evenement'] instanceOf baseevenement)) throw new Exception("No evenement found in userevenementType", 1);
		if(!($data['user'] instanceOf $data['UserClass']) && $data['UserManager'] !== null) {
			$data['user'] = $data['UserManager']->createUser();
			$data['user']->setEnabled(true);
		}
		if($userevenement->getEvenement() !== $data['evenement']) throw new Exception("Evenement is different!", 1);
		if($userevenement->getEvenement() === null) $userevenement->setEvenement($data['evenement']);
		if($data['user'] instanceOf $data['UserClass']) $userevenement->setUser($data['user']);
			else throw new Exception("Missing user for userevenementType.", 1);
		return $data;
	}

	/**
	 * @param FormBuilderInterface $builder
	 * @param array $options
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		// parent::buildForm($builder, $options);

		$userevenement = $builder->getData();
		if(!($userevenement instanceOf userevenement)) {
			// form without data…
			$builder
				->add('user')
				->add('message')
				->add('evenement')
				->add('parrainmailorname')
				->add('invitedevenements')
				;
			return;
		} else {
			extract($this->compilesTools($userevenement, $options));
			// Builder…
			if($user->getId() !== null) {
				$builder
					->add('user', new ProfileForUserevenementType($UserClass, $user), array(
						// 'compound' => true,
						'required' => true,
						'data_class' => $UserClass,
						'translation_domain' => 'userevenement',
						'attr'      => array(
							'class'         => 'input-sm form-control',
							),
						))
					;
			} else {
				$builder
					->add('user', new RegistrationForUserevenementType($UserClass, $user), array(
						// 'compound' => true,
						'required' => true,
						'data_class' => $UserClass,
						'translation_domain' => 'userevenement',
						'attr'		=> array(
							'class'		=> 'input-sm form-control',
							),
						))
					;
			}

			$builder
				->add('evenement', null, array(
					'data' => $evenement,
					))
				->add('message', 'textarea', array(
					'required'  => false,
					'attr'  => array(
						'style' => 'width:100%;resize:vertical;',
						'placeholder' => 'Votre message…',
						'rows' => '2',
						),
					))
				->add('parrainmailorname', LegacyFormHelper::getType('Symfony\Component\Form\Extension\Core\Type\EmailType'), array(
					'label'		=> 'fields.parrainmailorname',
					'label_attr'	=> array('class' => 'text-muted'),
					'translation_domain' => 'userevenement',
					'required'	=> false,
					'attr'		=> array(
						'class'			=> 'input-sm form-control text-center live_verif',
						'placeholder'	=> 'fields.parrainmailorname',
						'style'			=> 'width:280px;',
						'autocomplete'	=> 'off',
						),
					))
				// ->add('invitedevenements')
				;
		}

		$builder->addEventListener(
			FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($options) {
				$userevenement = $event->getData();
				$form = $event->getForm();
				// à conserver !! ci-dessous
				if(null === $userevenement) return;

				extract($this->compilesTools($userevenement, $options));

				if($user->getId() !== null) {
					$form
						->add('user', new ProfileForUserevenementType($UserClass, $user), array(
							// 'compound' => true,
							'required' => true,
							'data_class' => $UserClass,
							'translation_domain' => 'userevenement',
							'attr'      => array(
								'class'         => 'input-sm form-control',
								),
							))
						;
				} else {
					$form
						->add('user', new RegistrationForUserevenementType($UserClass, $user), array(
							// 'compound' => true,
							'required' => true,
							'data_class' => $UserClass,
							'translation_domain' => 'userevenement',
							'attr'		=> array(
								'class'		=> 'input-sm form-control',
								),
							))
						;
				}

				$form
					->add('message', 'textarea', array(
						'required'  => false,
						'attr'  => array(
							'style' => 'width:100%;resize:vertical;',
							'placeholder' => 'Votre message…',
							'rows' => '2',
							),
						))
					->add('parrainmailorname', LegacyFormHelper::getType('Symfony\Component\Form\Extension\Core\Type\EmailType'), array(
						'label'		=> 'fields.parrainmailorname',
						'label_attr'	=> array('class' => 'text-muted'),
						'translation_domain' => 'userevenement',
						'required'	=> false,
						'attr'		=> array(
							'class'			=> 'input-sm form-control text-center live_verif',
							'placeholder'	=> 'fields.parrainmailorname',
							'style'			=> 'width:280px;',
							'autocomplete'	=> 'off',
							),
						))
					;

				if($evenement->getMultiplaces() > 0) {
					$form
						->add('invitedevenements', 'collection', array(
							'type' => new invitedevenementType(),
							'required' => false,
							'allow_add' => $userevenement->isChangeable(),
							'allow_delete' => $userevenement->isChangeable(),
							'attr' => array(
								'class' => 'well well-sm addremoveelementsintype',
								'max-elements' => $evenement->getMultiplaces(),
								'max-message' => 'Vous ne pouvez pas inviter plus de personnes (max. '.$evenement->getMultiplaces().').',
								),
							))
						;
				}
			}
		);


	}

	public function configureOptions(OptionsResolver $resolver) {
		$resolver->setDefaults(array(
			'data_class' => 'Labo\Bundle\AdminBundle\Entity\userevenement',
			// 'attr'       => array(
				// 'class' => 'formloader liveform',
				// ),
		));
		$resolver->setDefined('controller')->setDefault('controller', null);
		$resolver->setDefined('evenement')->setDefault('evenement', null);
		$resolver->setDefined('user')->setDefault('user', null);
	}

	public function getName() {
		return 'site_adminsitebundle_userevenement';
	}

}