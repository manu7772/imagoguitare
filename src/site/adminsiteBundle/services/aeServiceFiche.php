<?php
namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManager;
// use Doctrine\ORM\Event\PreUpdateEventArgs;
// use Doctrine\ORM\Event\LifecycleEventArgs;

use Labo\Bundle\AdminBundle\services\aeServiceItem;

use Labo\Bundle\AdminBundle\Entity\fiche;

// call in controller with $this->get('aetools.aeServiceFiche');
class aeServiceFiche extends aeServiceItem {

    const NAME                  = 'aeServiceFiche';        // nom du service
    const CALL_NAME             = 'aetools.aeServiceFiche'; // comment appeler le service depuis le controller/container
    const CLASS_ENTITY          = 'Labo\Bundle\AdminBundle\Entity\fiche';
    const CLASS_SHORT_ENTITY    = 'fiche';

    public function __construct(ContainerInterface $container, EntityManager $EntityManager = null) {
        parent::__construct($container, $EntityManager);
        $this->defineEntity(self::CLASS_ENTITY);
        return $this;
    }

    // /**
    //  * Check entity integrity in context
    //  * @param fiche $entity
    //  * @param string $context ('new', 'PostLoad', 'PrePersist', 'PostPersist', 'PreUpdate', 'PostUpdate', 'PreRemove', 'PostRemove')
    //  * @param $eventArgs = null
    //  * @return aeServiceFiche
    //  */
    // public function checkIntegrity(&$entity, $context = null, $eventArgs = null) {
    //     parent::checkIntegrity($entity, $context, $eventArgs);
    //     // if($entity instanceOf fiche) {
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