# Protractor - Ende-zu-Ende-Tests und -Testautomatisierung von AngularJS-Applikationen

## Vorbemerkung

Ziel dieses Artikels soll es nicht sein, eine generelle Einführung in End-to-End (E2E) Testing zu geben. Es wird vorausgesetzt, dass dem Leser die Grundlagen von E2E Testing bereits geläufig sind. Im Idealfall wurden sogar erste Erfahrungen mit alternativen Tools wie die dem Karma Runner gemacht.

## AngularJS und End-to-End Testing

Wer sich bislang mit den Themen AngularJS und End-to-End Testing auseinandergesetzt hat, kam wohl am [Karma Runner](http://karma-runner.github.io) im Zusammenspiel mit dem [Angular Scenario Runner](http://docs.angularjs.org/guide/dev_guide.e2e-testing) kaum vorbei. Dem aufmerksamen Tester dürfte in diesem Fall aber auch nicht entgangen sein, dass der Angular Scenario Runner seit geraumer Zeit ein reichlich vernachlässigtes Dasein fristet. Eine Antwort auf die Frage, weshalb Angular Scenario derart vernachlässigt wurde und wird, blieb das AngularJS Team glücklicherweise nicht allzu lange schuldig: Man arbeitete an einer Alternative - [Protractor](https://github.com/angular/protractor).

 Und um es vorweg zu nehmen - bei Protractor wurde Vieles besser gemacht. Man hat hier nicht erneut den Fehler begangen, einen eigenen Runner mit einem Pseudo-Jasmine API zu entwickeln, sondern hat von Anfang an darauf Wert gelegt Bestehendes möglichst nahtlos zu integrieren. Protractor basiert daher auf Seleniums bewährtem [WebDriver](https://code.google.com/p/selenium/wiki/WebDriverJs), einem erweiterbaren API zur Browsersteuerung. Der Vorteil der WebDriver-Integration liegt auf der Hand: Für ein kleines Team wie das AngularJS Team war es auf Dauer schlicht unmöglich einen Test Runner zu pflegen, der nicht nur den existierenden Browsermodellen und -technologien gerecht zu werden, sondern dessen Weiterentwicklung mit der rasanten Entwicklung ebendieser Technologien Schrittzuhalten hat. Diese Mammutaufgabe sollte man den entsprechenden Spezialisten - [Selenium](http://docs.seleniumhq.org) - überlassen.

 Ein weiterer Vorteil von Protractor ist die Tatsache, dass man nicht wieder versucht hat, ein Test Framework API lediglich nachzuahmen - im Falle von Angular Scenario war es das von Jasmine - sondern darauf gesetzt hat, unterschiedliche Testframeworks integrieren zu können. Standardmäßig integriert Protractor Jasmine, eine Integration mit anderen Frameworks wie Cucumber oder Mocha ist aber ebenso möglich. Auf diese Weise stehen dann auch bislang bei Angular Scenario schmerzlich vermisste Features wie das Reporting der Testresultate in Continuous Integration  Systemen a lá Jenkins oder Travis zur Verfügung.

## Selenium WebDriver

TODO

## Installation

Da Protractor auf WebDriver basiert, benötigt man zu dessen Betrieb einen eigenständigen Selenium Server (standardmäßig auf [http://location:4444](http://location:4444), jedoch ist diese Einstellung konfigurierbar). Glücklicherweise enthält das Protractor Package bereits ein Tool, das die Installation und den Betrieb eines Selenium Servers extrem vereinfacht.

Zur Installation von Protractor genügt folgende Eingabe im Stammverzeichnis des Projekts, das künftig getestet werden soll:

	$ npm install protractor --save-dev

Den benötigten Selenium Server können wir nun mithilfe des eben erwähnten Tools ganz einfach installieren. Es befindet sich in Form eines Scripts im `node_modules` Ordner des Projekts. Windows-Nutzer sollten beachten, dass die angegebenen Pfade abweichen. `./node_modules/protractor/bin/` gilt es hier mit `./node_modules/.bin/` zu ersetzen.

	$ ./node_modules/protractor/bin/webdriver-manager update

Dieses Script lädt im Folgenden alle Dateien herunter, die dazu benötigt werden einen Selenium Server zu starten. Darüber hinaus werden aktuelle Versionen des ChromeDrivers (bei Bedarf auch des IEDrivers, etc.) heruntergeladen. Sobald das Script alle benötigten Dateien heruntergeladen hat, können wir unseren Selenium Server wie folgt starten:

	$ ./node_modules/protractor/bin/webdriver-manager start

Den Selenium Server lassen wir im Hintergrund laufen und sind nun in der Lage uns mit Protractor gegen diesen Server zu verbinden.

## Konfiguration

Doch vor der eigentlichen Arbeit kommt die Konfiguration. Genau wie Karma benötigt auch Protractor ein Konfigurationsskript, in dem wesentliche Einstellungen vorgenommen werden. Dieses Script enthält beispielsweise Angaben darüber, mit welchem Selenium Server sich Protractor verbinden soll, welche Test Specs ausgeführt werden sollen, etc. Eine einfache Konfiguration (beispielhaft `protractor.conf.js` genannt) könnte folgendermaßen aussehen:

	exports.config = {
		seleniumAddress: 'http://0.0.0.0:4444/wd/hub',
		capabilities: {
			browserName: 'chrome'
		},
		specs: ['test/e2e/**/*.spec.js'],
		jasmineNodeOpts: {
			showColors: true,
			includeStackTrace: true,
			defaultTimeoutInterval: 30000
		}
	};

Um die Tests auf Basis dieser Konfiguration auszuführen, bedienen wir uns des folgenden Scripts:

	$ ./node_modules/protractor/bin/protractor protractor.conf.js

## Test-Interna

Da wir unser Beispielprojekt der Einfachheit halber zur Verwendung mit Jasmine konfiguriert haben, gestaltet sich das Schreiben der Tests natürlich gewohnt:

	describe('test', function() {
		beforeEach(function() {
			// setup
		});

		afterEach(function() {
			// tear down
		});

		it('should be true', function() {
			expect(true).toBe(true);
			expect(true).not.toBe(false);
		});
	});

Der Sinn dieses Beispiels ist natürlich fraglich. Mit einem E2E Test hat obiger Code jedenfalls nichts zu tun. Für wirkliche E2E Tests sind wir darauf angewiesen, dass uns der Test Runner entsprechende Funktionalität bietet. Protrator stellt zu diesem Zweck einige globale Variablen zur Verfügung, über die wir in unseren Tests die Steuerung der Browser vornehmen können:

### browser

Im Wesentlichen stellt die Variable `browser` einen Wrapper um die eigentliche WebDriver-Instanz dar. `browser` bietet zum einen Funktionalität auf bestimmte Seiten zu navigieren, zum anderen aber auch, um bestimmte Informationen aus ebendiesen Seiten zu extrahieren. Der große Vorteil von `browser` besteht darin, dass grundlegende Probleme bei der Testautomatisierung - wie z.B. das Warten auf die Navigation zu einer bestimmten Seite oder das Routing zu einem bestimmten View - vom Endanwender verborgen werden. Protractor nennt dies die Synchronisationsphase, durch deren Hilfe der Code innerhalb der Tests auf eine nicht unerhebliche Menge an Glue-Code verzichten kann.

Leider muss an dieser Stelle ein riesengroßes **ABER** eingeschoben werden: All diese Convenience funktioniert derzeit ausschließlich beim Test von AngularJS-Anwendungen, und obendrein auch nur bei verhältnismäßig kleinen Anwendungen. Denn sobald die eigene Applikation sich Funktionalitäten wie manuellen [Bootstrap](http://docs.angularjs.org/guide/bootstrap#overview_manual-initialization)s oder [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)s bedient, ist es auch schon vorbei mit der Convenience. In diesem Fall muss man dann in den sauren Apfel beißen und direkt auf die WebDriver-Instanz - exposed via `browser.driver` - zugreifen, was üblicherweise aber mit erheblich mehr Verantwortung und Boilerplate/Glue-Code einhergeht.

Um zum Beispiel zu einer bestimmten Seite zu navigieren, können wir folgenden einfachen Code verwenden:

	beforeEach(function() {
		browser.get('http://127.0.0.1:8080/');
	});

TODO ...

## Automatisierung mittels Grunt

TODO

## SauceLabs Integration

TODO