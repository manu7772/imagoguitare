<?php

namespace site\adminsiteBundle\Form;

use Labo\Bundle\AdminBundle\Form\baseType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
// Transformer
use Symfony\Component\Form\CallbackTransformer;
// User
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage as SecurityContext;
// Paramétrage de formulaire
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;

use site\adminsiteBundle\Form\imageType;

class sectionType extends baseType {

	/**
	 * @param FormBuilderInterface $builder
	 * @param array $options
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		// ajout de action si défini
		$this->initBuilder($builder);
		$this->section = $this->controller->get('aetools.aeServiceSection');
		$this->imagesData = array(
			'image' => array(
				'owner' => 'section:image'
				),
			);
		// Builder…
		$builder
			->add('nom', 'text', array(
				'label' => 'fields.nom',
				'translation_domain' => 'section',
				'required' => true,
				))
			->add('descriptif', 'insRichtext', array(
				'label' => 'fields.descriptif',
				'translation_domain' => 'section',
				'required' => false,
				'attr' => array(
					'data-height' => 100,
					)
				))
			->add('code', 'insRichtext', array(
				'label' => 'fields.code',
				'translation_domain' => 'section',
				'required' => false,
				'attr' => array(
					'data-height' => 100,
					)
				))
			->add('modele', 'choice', array(
				'label' => 'fields.modele',
				'translation_domain' => 'section',
				'required' => true,
				'choice_list' => $this->section->getSectionChoices($builder->getData()->getExtended()),
				))
			// ->add('action', 'text', array(
			// 	'label' => 'fields.action',
			// 	'translation_domain' => 'section',
			// 	'required' => false,
			// 	))
			// 1 image :
			->add('image', new cropperType($this->controller, $this->imagesData), array(
				'label' => 'fields.image',
				'translation_domain' => 'section',
				'required' => false,
				))
            ->add('subentitys', 'entity', array(
                "label"     => 'fields.subentitys',
                'translation_domain' => 'section',
                'class'     => 'Labo\Bundle\AdminBundle\Entity\subentity',
                'choice_label'  => 'nom',
                'multiple'  => true,
                'required' => false,
                'group_by' => 'shortName',
                // "query_builder" => function($repo) {
                //     if(method_exists($repo, 'getDiaporamas'))
                //         return $repo->getDiaporamas();
                //         else return $repo->findAllClosure();
                //     },
                'placeholder'   => 'form.select',
                'attr'      => array(
                    'class'         => 'select2',
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
			'data_class' => 'site\adminsiteBundle\Entity\section'
		));
	}

	/**
	 * @return string
	 */
	public function getName() {
		return 'site_adminsitebundle_section';
	}
}
