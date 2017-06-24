<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace site\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ResettingFormType extends AbstractType
{
    private $class;

    /**
     * @param string $class The User class name
     */
    public function __construct($class)
    {
        $this->class = $class;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('plainPassword', 'repeated', array(
            'type' => 'password',
            'options' => array('translation_domain' => 'siteUserBundle'),
            'first_options' => array(
                'label' => 'form.new_password',
                'label_attr' => array('class' => 'text-muted'),
                'attr'  => array('class' => 'input-sm form-control'),
                ),
            'second_options' => array(
                'label' => 'form.new_password_confirmation',
                'label_attr' => array('class' => 'text-muted'),
                'attr'  => array('class' => 'input-sm form-control'),
                ),
            'invalid_message' => 'fos_user.password.mismatch',
        ));
    }

    public function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => $this->class,
            'intention'  => 'resetting',
        ));
    }

    public function getName()
    {
        return 'site_user_resetting';
    }
}
