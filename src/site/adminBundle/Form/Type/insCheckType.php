<?php
namespace site\adminBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class insCheckType extends AbstractType {

	public function setDefaultOptions(OptionsResolverInterface $resolver) {
		$resolver->setDefaults(array(
		));
	}

	public function getParent() {
		return 'checkbox';
	}

	public function getName() {
		return 'insCheck';
	}
}