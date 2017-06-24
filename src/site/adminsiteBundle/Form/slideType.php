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
use site\adminsiteBundle\Entity\slide;

class slideType extends baseType {

	/**
	 * @param FormBuilderInterface $builder
	 * @param array $options
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		// ajout de action si défini
		$this->initBuilder($builder);
		$data = $builder->getData();
		$nestedAttributesParameters = $data->getNestedAttributesParameters();
		// $this->imagesData = array(
		// 	'image' => array(
		// 		'owner' => 'slide:image'
		// 		),
		// 	)
		// ;
		// Builder…
		$slide = new slide();
		$builder
			->add('nom', 'text', array(
				'label' => 'fields.nom',
				'translation_domain' => 'slide',
				'required' => true,
				))
			->add('titre', 'text', array(
				'label' => 'fields.titre',
				'translation_domain' => 'slide',
				'required' => true,
				))
			->add('accroche', 'insRichtext', array(
				'label' => 'fields.accroche',
				'translation_domain' => 'slide',
				'required' => false,
				))
			// ->add('descriptif', 'insRichtext', array(
			// 	'label' => 'fields.descriptif',
			// 	'translation_domain' => 'slide',
			// 	'required' => false,
			// 	'attr' => array(
			// 		'data-height' => 400,
			// 		)
			// 	))
			->add('delay', 'text', array(
				'label' => 'fields.delay',
				'translation_domain' => 'slide',
				'required' => true,
				))
			->add('overlay', 'insCheck', array(
				'label' => 'fields.overlay',
				'translation_domain' => 'slide',
				'required' => false,
				))
			->add('lightext', 'insCheck', array(
				'label' => 'fields.lightext',
				'translation_domain' => 'slide',
				'required' => false,
				))
			->add('transition', 'choice', array(
				"required"  => true,
				"label"     => 'fields.transition',
				'translation_domain' => 'slide',
				'multiple'  => false,
				// 'expanded'  => true,
				"choices"   => $data->getTransitions(),
				))
			->add('youtube', 'text', array(
				'label' => 'fields.youtube',
				'translation_domain' => 'slide',
				'required' => false,
				))
			->add('autoplayvideo', 'insCheck', array(
				'label' => 'fields.autoplayvideo',
				'translation_domain' => 'slide',
				'required' => false,
				))
			->add('image', new cropperType($this->controller, array('image' => array('owner' => 'slide:image'))), array(
				'label' => 'fields.image',
				'translation_domain' => 'slide',
				'required' => false,
				))
			->add('couleur', 'insColorpicker', array(
				'label'     => 'fields.couleur',
				'translation_domain' => 'categorie',
				'required'  => false,
				))
			->add('item', 'entity', array(
				'label'		=> 'fields.item',
				'translation_domain' => 'slide',
				'choice_label'	=> 'nom',
				'class'		=> 'LaboAdminBundle:item',
				'multiple'	=> false,
				'required'	=> false,
				'placeholder'   => 'form.select',
				'attr'		=> array(
					'class'			=> 'select2',
					'placeholder'   => 'form.select',
					),
				))
			->add('tags', 'entity', array(
				'label'		=> 'name_s',
				'translation_domain' => 'tag',
				'choice_label'	=> 'nom',
				'class'		=> 'LaboAdminBundle:tag',
				'multiple'	=> true,
				'required'	=> false,
				'placeholder'   => 'form.select',
				'attr'		=> array(
					'class'			=> 'select2',
					'placeholder'   => 'form.select',
					),
				))
			// ->add('group_diaporama_slideParents', 'entity', array(
			// 	'by_reference' => false,
			// 	"label"		=> 'fields.group_diaporama_slideParents',
			// 	'translation_domain' => 'slide',
			// 	'choice_label'	=> 'nom',
			// 	'class'		=> 'LaboAdminBundle:nested',
			// 	'multiple'	=> true,
			// 	'expanded'	=> false,
			// 	"required"	=> $nestedAttributesParameters['diaporama_slide']['required'],
			// 	'placeholder'   => 'form.select',
			// 	'attr'		=> array(
			// 		'class'			=> 'select2',
			// 		'data-limit'	=> $nestedAttributesParameters['diaporama_slide']['data-limit'],
			// 		),
			// 	'group_by' => 'shortName',
			// 	"query_builder" => function($repo) use ($data, $nestedAttributesParameters) {
			// 		if(method_exists($repo, 'defaultValsListClosure'))
			// 			return $repo->defaultValsListClosure($this->controller, $nestedAttributesParameters['diaporama_slide']['class']);
			// 			else return $repo->findAllClosure();
			// 		},
			// 	))
		;
		// ajoute les valeurs hidden, passés en paramètre
		$this->addHiddenValues($builder, true);
	}

	/**
	 * @param OptionsResolver $resolver
	 */
	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults(array(
			'data_class' => 'site\adminsiteBundle\Entity\slide'
		));
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return 'site_adminsitebundle_slide';
	}
}
