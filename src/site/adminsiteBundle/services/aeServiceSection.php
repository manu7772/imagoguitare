<?php
namespace site\adminsiteBundle\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\Extension\Core\ChoiceList\ChoiceList;
use Doctrine\ORM\EntityManager;
use Labo\Bundle\AdminBundle\services\aeData;
// use Doctrine\ORM\Event\PreUpdateEventArgs;
// use Doctrine\ORM\Event\LifecycleEventArgs;

use Labo\Bundle\AdminBundle\services\aeServiceItem;

use site\adminsiteBundle\Entity\section;
use Labo\Bundle\AdminBundle\Entity\baseEntity;

class aeServiceSection extends aeServiceItem {


    protected $rootPath;            // Dossier root du site
    protected $bundles_list;
    protected $sectionfiles;
    // services
    protected $aeSystemfiles;

    const NAME                  = 'aeServiceSection';        // nom du service
    const CALL_NAME             = 'aetools.aeServiceSection'; // comment appeler le service depuis le controller/container
    const CLASS_ENTITY          = 'site\adminsiteBundle\Entity\section';
    const FOLD_BAS_SECTION      = 'sections';

    public function __construct(ContainerInterface $container, EntityManager $EntityManager = null) {
        parent::__construct($container, $EntityManager);
        $this->defineEntity(self::CLASS_ENTITY);
        $this->aeSystemfiles = $this->container->get(aeData::PREFIX_CALL_SERVICE.'aeSystemfiles');
        $this->aeSystemfiles->setRootPath(aeData::SLASH);
        $this->bundles_list = null;
        // récupération de fichiers et check
        $this->initFiles();
        return $this;
    }

    // /**
    //  * Check entity integrity in context
    //  * @param section $entity
    //  * @param string $context ('new', 'PostLoad', 'PrePersist', 'PostPersist', 'PreUpdate', 'PostUpdate', 'PreRemove', 'PostRemove')
    //  * @param $eventArgs = null
    //  * @return aeServiceSection
    //  */
    // public function checkIntegrity(&$entity, $context = null, $eventArgs = null) {
    //     parent::checkIntegrity($entity, $context, $eventArgs);
    //     // if($entity instanceOf section) {
    //         switch(strtolower($context)) {
    //             case 'new':
    //                 $this->completeSection($entity);
    //                 break;
    //             case 'postload':
    //                 $this->completeSection($entity);
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


    // public function getDefaultSections() {
    //     $sections = $this->getRepo()->findByDefault(1);
    //     foreach ($sections as $section) {
    //         $this->completeSection($section);
    //     }
    //     return $sections;
    // }

    // public function getSectionBySlug($itemSlug) {
    //     $section = $this->getRepo()->getOneBySlug($itemSlug);
    //     return is_object($section) ? $this->completeSection($section) : null;
    // }

    protected function initFiles() {
        // initialisation
        $this->sectionfiles = array();
        // récupération des bundles
        foreach($this->getBundles() as $bundle) {
            // basic
            $folders = $this->aeSystemfiles->exploreDir($bundle['sitepath'].$bundle['nom'], self::FOLD_BAS_SECTION, "dossiers", true);
            if(count($folders) > 0) {
                foreach($folders as $pw_folder) {
                    $path = $pw_folder['sitepath'].$pw_folder['nom'];
                    $files = $this->aeSystemfiles->exploreDir($path, '\.section\.twig$', true);
                    if(count($files) > 0) foreach ($files as $file) {
                        $this->sectionfiles[$file['sitepath'].$file['nom']] = preg_replace('#\.section\.twig$#i', '', $file['nom']);
                    }
                }
            }
        }
        return $this;
    }

    protected function getBundles() {
        if($this->bundles_list == null) {
            $this->bundles_list = $this->aeSystemfiles->exploreDir(aeData::SOURCE_FILES, aeData::BUNDLE_EXTENSION.'$', "dossiers");
            foreach($this->bundles_list as $key => $bundle) {
                $this->bundles_list[$key]['bundlename'] = str_replace('/', '', (preg_replace('#^'.aeData::SOURCE_FILES.'#', '', $bundle['sitepath']))).$bundle['nom'];
            }
        }
        return $this->bundles_list;
    }

    public function getModels() {
        return $this->sectionfiles;
    }

    public function getSectionChoices() {
        $models = $this->getModels();
        return new ChoiceList(array_keys($models), array_values($models));
    }

    // public function completeSection(&$section) {
    //     if(is_object($section)) return $section;
    //     if(!is_array($section)) return $section;
    //     // template
    //     $path = preg_split('#(src/|Resources/|views/|/)#', $section['section']["modele"]);
    //     $section['section']["template"] = implode(array_slice($path, 0, -2)).':'.$path[count($path)-2].':'.$path[count($path)-1];
    //     // model name
    //     $path = explode("/", $section['section']["modele"]);
    //     $section['section']["modelename"] = preg_replace("#\.section\.twig$#", '', end($path));
    //     // intégration id liés
    //     foreach ($section as $key => $value) if($key != 'section') {
    //         $section['section']['#'.$key] = $value;
    //     }
    //     $section = $section['section'];
    //     // result
    //     return $section;
    // }
}