<?php
namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Labo\Bundle\AdminBundle\services\aeServiceBaseEntity;
use Doctrine\ORM\EntityManager;
// use Doctrine\ORM\Event\PreUpdateEventArgs;
// use Doctrine\ORM\Event\LifecycleEventArgs;

use site\adminsiteBundle\Entity\tauxTva;
use Labo\Bundle\AdminBundle\Entity\baseEntity;

// call in controller with $this->get('aetools.aeTauxTva');
class aeServiceTauxTva extends aeServiceBaseEntity {

    const NAME                  = 'aeServiceTauxTva';        // nom du service
    const CALL_NAME             = 'aetools.aeTauxTva'; // comment appeler le service depuis le controller/container
    const CLASS_ENTITY          = 'site\adminsiteBundle\Entity\tauxTva';
    const CLASS_SHORT_ENTITY    = 'panier';

    public function __construct(ContainerInterface $container, EntityManager $EntityManager = null) {
        parent::__construct($container, $EntityManager);
        $this->defineEntity(self::CLASS_ENTITY);
        return $this;
    }


    // /**
    //  * Check entity integrity in context
    //  * @param tauxTva $entity
    //  * @param string $context ('new', 'PostLoad', 'PrePersist', 'PostPersist', 'PreUpdate', 'PostUpdate', 'PreRemove', 'PostRemove')
    //  * @param $eventArgs = null
    //  * @return aeServiceTauxTva
    //  */
    // public function checkIntegrity(&$entity, $context = null, $eventArgs = null) {
    //     parent::checkIntegrity($entity, $context, $eventArgs);
    //     // if($entity instanceOf tauxTva) {
    //         switch(strtolower($context)) {
    //             case 'new':
    //                 break;
    //             case 'postload':
    //                 break;
    //             case 'prepersist':
    //                 break;
    //             case 'postpersist':
    //                 break;
    //             case 'preupdate':
    //                 break;
    //             case 'postupdate':
    //                 break;
    //             case 'preremove':
    //                 break;
    //             case 'postremove':
    //                 break;
    //             default:
    //                 break;
    //         }
    //     // }
    //     return $this;
    // }

}