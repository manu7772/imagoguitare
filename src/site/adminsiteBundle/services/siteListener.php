<?php

namespace site\adminsiteBundle\services;

use Labo\Bundle\AdminBundle\services\siteListener as base_siteListener;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Labo\Bundle\AdminBundle\Controller\baseController;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
// use Symfony\Component\DependencyInjection\ContainerInterface;
// use Symfony\Bundle\TwigBundle\Controller\ExceptionController;
use Labo\Bundle\AdminBundle\services\aeData;

use \Exception;

class siteListener extends base_siteListener {

	// const NAME = 'siteListener';
	const ROUTE_GENERATE = 'generate';

	protected $router;

	/**
	* @param FilterControllerEvent $event
	*/
	public function load(FilterControllerEvent $event) {
		$this->container = $event->getController()[0];
		// $this->container = $event->getRequest()->attributes->get('_controller');
		if($this->container instanceOf Controller) {
			$this->router = $this->container->get('router');
			// only master request
			if($event->isMasterRequest()) {
				// trash categorie control in is in Labo
				if($this->container instanceOf baseController) {
					$aeServiceCategorie = $this->container->get(aeData::PREFIX_CALL_SERVICE.'aeServiceCategorie');
					$aeServiceCategorie->controlTrashCategorie();
				}
				// sitedata
				$site = $this->container->get('aetools.aeServiceSite')->getRepo()->findOneByDefault(1);
				$grantedRoutes = array(
					self::ROUTE_GENERATE,
					'fos_user_security_login',
					);
				if(is_object($site)) {
					$twig = $this->container->get('twig');
					$twig->addGlobal('site', $site);
				} else if(!in_array($event->getRequest()->get('_route'), $grantedRoutes)) {
					// no data on site -> redirect to generation
					// https://stackoverflow.com/questions/40433405/redirect-to-another-symfony-route-from-filtercontrollerevent-listener
					$redirectUrl = $this->getRedirectToGenerate($event->getRequest());
					// throw new Exception("NO SITE DATA : route ".json_encode($event->getRequest()->get('_route')).' redirected to url '.json_encode($redirectUrl).'!', 1);
					$event->setController(function() use ($redirectUrl) {
						return new RedirectResponse($redirectUrl);
					});
				}
				
				// user info
				$olddata = (array)$event->getRequest()->getSession()->get('user');
				$olddata['ip'] = $event->getRequest()->getClientIp();
				$event->getRequest()->getSession()->set('user', $olddata);
			}
		}
	}

	public function getRedirectToGenerate(Request $Request) {
		$httpHost = $Request->getSchemeAndHttpHost();
		$locale = $Request->getLocale();
		switch($httpHost) {
			case 'http://localhost':
				// LOCALHOST
				return $this->router->generate(self::ROUTE_GENERATE);
				break;
			default:
				// WEB SITE
				$test = preg_match('#^((http|https)://)?test(admin)?\.#', $httpHost) ? 'testadmin' : 'admin';
				$domain_admin = $this->container->getParameter('site_domains')[$test];
				return $domain_admin['reseau'].$domain_admin['prefix'].'.'.$domain_admin['domain'].'.'.$domain_admin['extensions'][0].'/'.$locale;
				break;
		}
	}


}