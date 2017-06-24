<?php
// src/site/UserBundle/Form/Type/RegistrationFormType.php

namespace site\UserBundle\Form\Type;

use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
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
use Labo\Bundle\AdminBundle\Form\imageType;
use site\adminsiteBundle\Form\cropperType;
use site\adminsiteBundle\Form\userAdresseType;

class RegistrationFormType extends BaseType {

    private $class;

    public function __construct($class) {
        parent::__construct($class);
        $this->class = $class;
    }

    public function buildForm(FormBuilderInterface $builder, array $options) {
        parent::buildForm($builder, $options);
        // add your custom field
        $entity = new User();

        $builder
            ->add('username', null, array(
                'label' => 'fields.username',
                'label_attr' => array('class' => 'text-muted'),
                'translation_domain' => 'siteUserBundle',
                'attr'      => array(
                    'class'         => 'input-sm form-control',
                    'placeholder'   => 'fields.username',
                    ),
                ))
            ->add('email', 'email', array(
                'label' => 'fields.email',
                'label_attr' => array('class' => 'text-muted'),
                'translation_domain' => 'siteUserBundle',
                'attr'      => array(
                    'class'         => 'input-sm form-control',
                    'placeholder'   => 'fields.email',
                    ),
                ))
            ->add('nom', 'text', array(
                'label'     => 'fields.nom',
                'label_attr' => array('class' => 'text-muted'),
                'translation_domain' => 'siteUserBundle',
                'required'  => false,
                'attr'      => array(
                    'class'         => 'input-sm form-control',
                    'placeholder'   => 'fields.nom',
                    ),
                ))
            ->add('prenom', 'text', array(
                'label'     => 'fields.prenom',
                'label_attr' => array('class' => 'text-muted'),
                'translation_domain' => 'siteUserBundle',
                'required'  => false,
                'attr'      => array(
                    'class'         => 'input-sm form-control',
                    'placeholder'   => 'fields.prenom',
                    ),
                ))
            ->add('plainPassword', 'repeated', array(
                'type' => 'password',
                'options' => array('translation_domain' => 'siteUserBundle'),
                'first_options' => array(
                    'label' => 'form.password',
                    'label_attr' => array('class' => 'text-muted'),
                    'attr'  => array('class' => 'input-sm form-control'),
                    ),
                'second_options' => array(
                    'label' => 'form.password_confirmation',
                    'label_attr' => array('class' => 'text-muted'),
                    'attr'  => array('class' => 'input-sm form-control'),
                    ),
                'invalid_message' => 'fos_user.password.mismatch',
                ))
            ->add('telephone', 'text', array(
                'translation_domain' => 'siteUserBundle',
                'label'     => 'fields.telephone',
                'label_attr' => array('class' => 'text-muted'),
                'required'  => false,
                'attr' => array(
                    'class' => 'input-sm form-control',
                    'placeholder'   => 'fields.telephone',
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
            ->add('adresse', new userAdresseType(), array(
                'label' => 'Adresse',
                'required' => false,
                ))
            // ->add('adresseLivraison', new userAdresseType(), array(
            //     'label' => 'Adresse de livraison',
            //     'required' => false,
            //     ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'data_class' => 'site\UserBundle\Entity\User',
            // 'intention'  => 'profile',
            'attr'       => array(
                'class' => 'form-horizontal',
                )
        ));
    }

    public function getName() {
        return 'site_user_registration';
    }

}