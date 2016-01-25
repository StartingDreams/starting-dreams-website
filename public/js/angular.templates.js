(function(){angular.module("sdTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("pages/about/body.tmpl.html","<section id=\"about\" class=\"about\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-lg-12 text-center\">\n                <h2>Starting Dreams</h2>\n                <p class=\"lead\">I am a local programmer that builds websites as my full time job.</p>\n                <p class=\"lead\">When you hire me you will not have someone that you will never meet building your website.</p>\n                <p class=\"lead\">I will meet you in person and together we will figure out your needs and design a website that is perfect for you.</p>\n            </div>\n            <div class=\"col-lg-12 text-center\">\n                <h2>HISTORY</h2>\n                <p class=\"lead\">I opened Starting Dreams on July 23 2000.</p>\n                <p class=\"lead\">I have 15 years experience building and designing websites.</p>\n            </div>\n        </div>\n    </div>\n</section>");
$templateCache.put("pages/contact/block.tmpl.html","<aside class=\"call-to-action bg-sd-primary\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-lg-12 text-center\">\n                <h3>Local ~ Professional ~ Experienced</h3>\n                <a ui-sref=\"services\" ui-sref-active=\"active\" class=\"btn btn-default\"><i class=\"fa fa-cogs\"></i> Services</a>\n                <a ui-sref=\"portfolio\" href=\"#\" ui-sref-active=\"active\" class=\"btn btn-default\"><i class=\"fa fa-briefcase\"></i> Portfolio</a>\n                <a ui-sref=\"contact\" href=\"#\" ui-sref-active=\"active\" class=\"btn btn-default\"><i class=\"fa fa-phone\"></i> Contact</a>\n            </div>\n        </div>\n    </div>\n</aside>");
$templateCache.put("pages/contact/body.tmpl.html","<section id=\"contact\">\n    <aside class=\"call-to-action\">\n        <div class=\"container address\">\n            <div class=\"row\">\n                <div class=\"col-sm-12 text-center\">\n                    <h1><strong>Starting Dreams</strong></h1>\n                </div>\n                <div class=\"col-sm-6 text-center\">\n                    <address>\n                        5228 NW 25th Place<br>\n                        Gainesville, FL 32606<br>\n                    </address>\n                </div>\n                <div class=\"col-sm-6 text-center\">\n                    <ul class=\"list-unstyled\">\n                        <li><i class=\"fa fa-envelope-o fa-fw\"></i> <a href=\"mailto:david@startingdreams.com\">david@startingdreams.com</a></li>\n                        <li><i class=\"fa fa-phone fa-fw\"></i> (352) 339-4599</li>\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </aside>\n    <div class=\"bg-sd-primary\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <h2 class=\"text-center\">\n                    We are located in Gainesville, Florida.\n                </h2>\n            </div>\n        </div>\n    </div>\n    <sd-map></sd-map>\n</section>");
$templateCache.put("pages/home/body.tmpl.html","<div id=\"home\">\n    <div class=\"text-vertical-center\">\n        <h1><img class=\"logo img-responsive\" src=\"/media/images/logo/starting-dreams-light.svg\" title=\"Starting Dreams\" alt=\"Starting Dreams\"></h1>\n        <h1>Website Development</h1>\n        <a ui-sref=\"services\" class=\"btn btn-lg btn-sd-primary btn-square\"><i class=\"fa fa-cogs\"></i> Services</a>\n        <a ui-sref=\"portfolio\" class=\"btn btn-lg btn-sd-primary btn-square\"><i class=\"fa fa-briefcase\"></i> Portfolio</a>\n        <a ui-sref=\"contact\" class=\"btn btn-lg btn-sd-primary btn-square\"><i class=\"fa fa-phone\"></i> Contact</a>\n    </div>\n\n\n</div>\n");
$templateCache.put("pages/portfolio/body.tmpl.html","<section id=\"portfolio\" class=\"portfolio\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-lg-10 col-lg-offset-1 text-center\">\n                <h2>Our Work</h2>\n                <hr class=\"small\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"portfolio-item\">\n                            <a href=\"https://www.casjax.com\">\n                                <img class=\"img-portfolio img-responsive\" src=\"/media/images/portfolio/cas.png\">\n                            </a>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"portfolio-item\">\n                            <a href=\"http://www.officeaccessoriesplus.com\">\n                                <img class=\"img-portfolio img-responsive\" src=\"/media/images/portfolio/oap.png\">\n                            </a>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"portfolio-item\">\n                            <a href=\"http://www.strictlytoolboxes.com\">\n                                <img class=\"img-portfolio img-responsive\" src=\"/media/images/portfolio/stb.png\">\n                            </a>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"portfolio-item\">\n                            <a href=\"http://www.deluxepillows.com\">\n                                <img class=\"img-portfolio img-responsive\" src=\"/media/images/portfolio/dp.png\">\n                            </a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section>");
$templateCache.put("pages/services/body.tmpl.html","<section id=\"services\">\n    <div class=\"services bg-sd-secondary\">\n    <div class=\"container \">\n        <div class=\"row text-center\">\n            <div class=\"col-lg-10 col-lg-offset-1\">\n                <h2>Our Services</h2>\n                <hr class=\"small\">\n                <div class=\"row\">\n                    <div class=\"col-md-3 col-sm-6 pointer\" ng-click=\"vm.gotoElement(\'website\')\">\n                        <div class=\"service-item\">\n                                <span class=\"fa-stack fa-4x\">\n                                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                                <i class=\"fa fa-desktop fa-stack-1x text-primary\"></i>\n                            </span>\n                            <h4>\n                                <strong>Website</strong>\n                            </h4>\n                            <p>Programming and design.</p>\n                        </div>\n                    </div>\n                    <div class=\"col-md-3 col-sm-6 pointer\" ng-click=\"vm.gotoElement(\'mobile\')\">\n                        <div class=\"service-item\">\n                                <span class=\"fa-stack fa-4x\">\n                                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                                <i class=\"fa fa-mobile fa-stack-1x text-primary\"></i>\n                            </span>\n                            <h4>\n                                <strong>Mobile</strong>\n                            </h4>\n                            <p>Mobile friendly design.</p>\n                        </div>\n                    </div>\n                    <div class=\"col-md-3 col-sm-6 pointer\" ng-click=\"vm.gotoElement(\'cloud\')\">\n                        <div class=\"service-item\">\n                                <span class=\"fa-stack fa-4x\">\n                                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                                <i class=\"fa fa-cloud fa-stack-1x text-primary\"></i>\n                            </span>\n                            <h4>\n                                <strong>Cloud</strong>\n                            </h4>\n                            <p>Custom software services.</p>\n                        </div>\n                    </div>\n                    <div class=\"col-md-3 col-sm-6 pointer\" ng-click=\"vm.gotoElement(\'consultation\')\">\n                        <div class=\"service-item\">\n                                <span class=\"fa-stack fa-4x\">\n                                <i class=\"fa fa-circle fa-stack-2x\"></i>\n                                <i class=\"fa fa-bullseye fa-stack-1x text-primary\"></i>\n                            </span>\n                            <h4>\n                                <strong>Consultation</strong>\n                            </h4>\n                            <p>A phone call away.</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    </div>\n    <div class=\"bg-sd-primary\" id=\"website\">\n        <div class=\"container text-center\">\n            <h1>Websites</h1>\n            <p class=\"lead\">Planning, designing, and then creating a website requires experience.</p>\n            <p class=\"lead\">Together we will discuss your real needs without buzzwords or marketing speech.</p>\n            <p class=\"lead\">I will meet with you in person.</p>\n        </div>\n    </div>\n    <div class=\"bg-sd-secondary\" id=\"mobile\">\n        <div class=\"container text-center\">\n            <h1>Mobile</h1>\n            <p class=\"lead\">Mobile friendly websites are a requirement in today\'s mobile heavy world.</p>\n            <p class=\"lead\">Google is searched by mobile devices more often than PC\'s.</p>\n        </div>\n    </div>\n    <div class=\"bg-sd-primary\" id=\"cloud\">\n        <div class=\"container text-center\">\n            <h1>Cloud</h1>\n            <p class=\"lead\">Want to include Google Map services? Facebook integration? Google Analytics?</p>\n            <p class=\"lead\">Connect your website with different cloud services.</p>\n        </div>\n    </div>\n    <div class=\"bg-sd-secondary\" id=\"consultation\">\n        <div class=\"container text-center\">\n            <h1>Consultation</h1>\n            <p class=\"lead\">Avoid Common mistakes and gotchas before they cost you thousands.</p>\n            <p class=\"lead\">Thinking about spending money on something a telemarketer is trying to sell you?</p>\n            <p class=\"lead\">Have questions about online advertising?</p>\n            <p class=\"lead\">Ask for advice from someone in the field that isn\'t trying to sell you something.</p>\n            <p class=\"lead\">Hourly billing available for general website and e-commerce advice.</p>\n        </div>\n    </div>\n</section>");
$templateCache.put("pages/sidebar/nav.tmpl.html","<div class=\"list-group\">\n    <a ui-sref=\"home\" ui-sref-active=\"active\" class=\"list-group-item\"><i class=\"fa fa-home\"></i> Home</a>\n    <a ui-sref=\"services\" ui-sref-active=\"active\" class=\"list-group-item\"><i class=\"fa fa-cogs\"></i> Services</a>\n    <a ui-sref=\"portfolio\" href=\"#\" ui-sref-active=\"active\" class=\"list-group-item\"><i class=\"fa fa-briefcase\"></i> Portfolio</a>\n    <a ui-sref=\"about\" href=\"#\" ui-sref-active=\"active\" class=\"list-group-item\"><i class=\"fa fa-question-circle\"></i> About</a>\n    <a ui-sref=\"contact\" href=\"#\" ui-sref-active=\"active\" class=\"list-group-item\"><i class=\"fa fa-phone\"></i> Contact</a>\n</div>");
$templateCache.put("common/blocks/content/content.tmpl.html","<content ng-class=\"vm.state.layout.body.full ? \'full-height-body\' : \'\'\">\n    <div id=\"body\" ui-view=\"body\" autoscroll=\"true\"></div>\n</content>");
$templateCache.put("common/blocks/footer/footer.tmpl.html","<footer>\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-lg-10 col-lg-offset-1 text-center\">\n                <h4><strong>Starting Dreams</strong>\n                </h4>\n                <p>5228 NW 25th Place<br>Gainesville, FL 32606</p>\n                <ul class=\"list-unstyled\">\n                    <li><i class=\"fa fa-phone fa-fw\"></i> (352) 339-4599</li>\n                    <li><i class=\"fa fa-envelope-o fa-fw\"></i>  <a href=\"mailto:david@startingdreams.com\">david@startingdreams.com</a>\n                    </li>\n                </ul>\n                <hr class=\"small\">\n                <p class=\"text-muted\">Copyright &copy; Starting Dreams 2016</p>\n            </div>\n        </div>\n    </div>\n</footer>\n");
$templateCache.put("common/blocks/header/header.tmpl.html","<header id=\"page-top\">\n    <nav class=\"navbar navbar-fixed-top navbar-inverse clearfix\">\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header pull-left\">\n                <a class=\"navbar-brand\" href=\"/\"><img src=\"/media/images/logo/starting-dreams-light.svg\" alt=\"Starting Dreams\" title=\"Starting Dreams\" class=\"logo\"/></a>\n            </div>\n            <button type=\"button\" class=\"btn btn-link navbar-btn pull-right visible-xs-inline-block\" ng-click=\"vm.toggleSidebar()\"><i class=\"fa fa-bars\"></i></button>\n            <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n                <ul class=\"nav navbar-nav\">\n                    <li ui-sref-active=\"active\"><a ui-sref=\"home\" ><i class=\"fa fa-home\"></i> Home</a></li>\n                    <li ui-sref-active=\"active\"><a ui-sref=\"services\" ><i class=\"fa fa-cogs\"></i> Services</a></li>\n                    <li ui-sref-active=\"active\"><a ui-sref=\"portfolio\" ><i class=\"fa fa-briefcase\"></i> Portfolio</a></li>\n                    <li ui-sref-active=\"active\"><a ui-sref=\"about\"><i class=\"fa fa-question-circle\"></i> About</a></li>\n                    <li ui-sref-active=\"active\"><a ui-sref=\"contact\" ><i class=\"fa fa-mobile\"></i> Contact</a></li>\n                </ul>\n            </div>\n\n        </div>\n    </nav>\n</header>");
$templateCache.put("common/blocks/map/map.tmpl.html","<section class=\"map\">\n    <iframe width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" ng-src=\"{{ vm.mapUrl }}\"></iframe>\n</section>");
$templateCache.put("common/blocks/sidebar/sidebar.tmpl.html","<sidebar ng-class=\"vm.sidebar.open ? \'active\' : \'closed\'\">\n    <div ui-view=\"sidebar\"></div>\n</sidebar>\n");}]);})();