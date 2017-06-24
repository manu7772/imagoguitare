<?php
namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManager;
use Labo\Bundle\AdminBundle\services\aeData;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\Common\Collections\ArrayCollection;

use Labo\Bundle\AdminBundle\services\aeUnits as baseAeUnits;

// call in controller with $this->get('aetools.aeServiceSite');
class aeUnits extends baseAeUnits {


    public function __construct() {
        // parent::__construct();
        $this->units = array(
            // quantité
            'bout' => array(
                'name' => 'bouteille',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1,
                    'p' => 1,
                    'x3' => 3,
                    'x6' => 6,
                    'x12' => 12,
                    'x20' => 20,
                    'x50' => 50,
                    'x100' => 100,
                    ),
                ),
            'p' => array(
                'name' => 'pièce',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1,
                    'p' => 1,
                    'x3' => 3,
                    'x6' => 6,
                    'x12' => 12,
                    'x20' => 20,
                    'x50' => 50,
                    'x100' => 100,
                    ),
                ),
            'x3' => array(
                'name' => 'les 3',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/3,
                    'p' => 1/3,
                    'x3' => 3/3,
                    'x6' => 6/3,
                    'x12' => 12/3,
                    'x20' => 20/3,
                    'x50' => 50/3,
                    'x100' => 100/3,
                    ),
                ),
            'x6' => array(
                'name' => 'les 6',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/6,
                    'p' => 1/6,
                    'x3' => 3/6,
                    'x6' => 6/6,
                    'x12' => 12/6,
                    'x20' => 20/6,
                    'x50' => 50/6,
                    'x100' => 100/6,
                    ),
                ),
            'x12' => array(
                'name' => 'douzaine',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/12,
                    'p' => 1/12,
                    'x3' => 3/12,
                    'x6' => 6/12,
                    'x12' => 12/12,
                    'x20' => 20/12,
                    'x50' => 50/12,
                    'x100' => 100/12,
                    ),
                ),
            'x20' => array(
                'name' => 'vingtaine',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/20,
                    'p' => 1/20,
                    'x3' => 3/20,
                    'x6' => 6/20,
                    'x12' => 12/20,
                    'x20' => 20/20,
                    'x50' => 50/20,
                    'x100' => 100/20,
                    ),
                ),
            'x50' => array(
                'name' => 'cinquantaine',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/50,
                    'p' => 1/50,
                    'x3' => 3/50,
                    'x6' => 6/50,
                    'x12' => 12/50,
                    'x20' => 20/50,
                    'x50' => 50/50,
                    'x100' => 100/50,
                    ),
                ),
            'x100' => array(
                'name' => 'centaine',
                'group' => 'Quantités',
                'corresp' => array(
                    'bout' => 1/100,
                    'p' => 1/100,
                    'x3' => 3/100,
                    'x6' => 6/100,
                    'x12' => 12/100,
                    'x20' => 20/100,
                    'x50' => 50/100,
                    'x100' => 100/100,
                    ),
                ),
            // poids
            'Kg' => array(
                'name' => 'kilogramme',
                'group' => 'Poids',
                'corresp' => array(
                    'Kg' => 1,
                    'g' => 0.001,
                    ),
                ),
            'g' => array(
                'name' => 'gramme',
                'group' => 'Poids',
                'corresp' => array(
                    'Kg' => 1000,
                    'g' => 1,
                    ),
                ),
            // volume
            'L' => array(
                'name' => 'litre',
                'group' => 'Volumes',
                'corresp' => array(
                    'L' => 1,
                    'dl' => 0.1,
                    'cl' => 0.01,
                    'ml' => 0.001,
                    ),
                ),
            'dl' => array(
                'name' => 'décilitre',
                'group' => 'Volumes',
                'corresp' => array(
                    'L' => 10,
                    'dl' => 1,
                    'cl' => 0.1,
                    'ml' => 0.01,
                    ),
                ),
            'cl' => array(
                'name' => 'centilitre',
                'group' => 'Volumes',
                'corresp' => array(
                    'L' => 100,
                    'dl' => 10,
                    'cl' => 1,
                    'ml' => 0.1,
                    ),
                ),
            'ml' => array(
                'name' => 'millilitre',
                'group' => 'Volumes',
                'corresp' => array(
                    'L' => 1000,
                    'dl' => 100,
                    'cl' => 10,
                    'ml' => 1,
                    ),
                ),
            );
        $keys = $this->getListOfUnits();
        $this->setDefaultUnit(reset($keys));
    }

}