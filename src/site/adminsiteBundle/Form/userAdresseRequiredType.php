<?php

namespace site\adminsiteBundle\Form;

use Labo\Bundle\AdminBundle\Form\baseType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Validator\Constraints\NotNull;
// Transformer
use Symfony\Component\Form\CallbackTransformer;
// User
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage as SecurityContext;
// Paramétrage de formulaire
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

class userAdresseRequiredType extends baseType {

    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options) {
        // ajout de action si défini
        $this->initBuilder($builder);
        // Builder…
        $builder
            // ->add('nom', 'text', array(
            //     'label' => 'fields.nom',
            //     'translation_domain' => 'adresse',
            //     'required' => true,
            //     ))
            ->add('adresse', 'textarea', array(
                'label' => 'fields.adresse',
                'translation_domain' => 'adresse',
                'required' => true,
                'attr' => array(
                    'class' => 'input-sm form-control live_verif',
                    'placeholder'   => 'fields.adresse',
                    ),
                'constraints' => array(
                    new NotNull(array('message' => 'Indiquez votre adresse.')),
                    ),
                ))
            ->add('cp', 'text', array(
                "required"  => true,
                "label"     => 'fields.cp',
                'translation_domain' => 'adresse',
                'attr' => array(
                    'class' => 'input-sm form-control live_verif',
                    'placeholder'   => 'fields.cp',
                    ),
                'constraints' => array(
                    new NotNull(array('message' => 'Indiquez votre code postal.')),
                    ),
                ))
            ->add('ville', 'text', array(
                "required"  => true,
                "label"     => 'fields.ville',
                'translation_domain' => 'adresse',
                'attr' => array(
                    'class' => 'input-sm form-control live_verif',
                    'placeholder'   => 'fields.ville',
                    ),
                'constraints' => array(
                    new NotNull(array('message' => 'Indiquez votre ville.')),
                    ),
                ))
        ;
        // ajoute les valeurs hidden, passés en paramètre
        $this->addHiddenValues($builder, true);
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver) {
        $resolver->setDefaults(array(
            'data_class' => 'site\adminsiteBundle\Entity\adresse'
        ));
    }

    /**
     * @return string
     */
    public function getName() {
        return 'site_adminsitebundle_useradresse';
    }
}
