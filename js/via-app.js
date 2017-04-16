var app = angular.module('viaApp', ['ngMaterial', 'ngMessages', 'ngAnimate', 'ngResource', 'ui.grid', 'ui.grid.selection',
	'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.cellNav', 'ui.bootstrap', 'cgBusy', 'angularSpinner']);

app.config(function($mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '900', // by default use shade 900 (Dark Blue) for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '500', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('red', {
      'default': 'A700' // use shade 200 for default, and keep all other shades the same
    })
	.warnPalette('red', {
      'default': '900', // by default use shade 400 for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '500', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    });

},

app.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    // $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])

);

app.factory('ViaData', function ($rootScope) {

    var servicesRoot = '/buiservices';
    var URLtransaction = servicesRoot + '/transactions';


    var defaultDiacriticsRemovalMap = [
        {'base':'+','letters':/[\u00B1]/g},
        {'base':',','letters':/[\u201A]/g},
        {'base':'-','letters':/[\u00AC]/g},
        {'base':'a','letters':/[\u00E2]/g},
        {'base':'-','letters':/[\u2013\u00BD]/g},
        {'base':'A', 'letters':/[\u009D\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
        {'base':'AA','letters':/[\uA732]/g},
        {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
        {'base':'AO','letters':/[\uA734]/g},
        {'base':'AU','letters':/[\uA736]/g},
        {'base':'AV','letters':/[\uA738\uA73A]/g},
        {'base':'AY','letters':/[\uA73C]/g},
        {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
        {'base':'DZ','letters':/[\u01F1\u01C4]/g},
        {'base':'Dz','letters':/[\u01F2\u01C5]/g},
        {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
        {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
        {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
        {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
        {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
        {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
        {'base':'LJ','letters':/[\u01C7]/g},
        {'base':'Lj','letters':/[\u01C8]/g},
        {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
        {'base':'NJ','letters':/[\u01CA]/g},
        {'base':'Nj','letters':/[\u01CB]/g},
        {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
        {'base':'OI','letters':/[\u01A2]/g},
        {'base':'OO','letters':/[\uA74E]/g},
        {'base':'OU','letters':/[\u0222]/g},
        {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
        {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
        {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
        {'base':'TZ','letters':/[\uA728]/g},
        {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
        {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'base':'VY','letters':/[\uA760]/g},
        {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
        {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
        {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
        {'base':'aa','letters':/[\uA733]/g},
        {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
        {'base':'ao','letters':/[\uA735]/g},
        {'base':'au','letters':/[\uA737]/g},
        {'base':'av','letters':/[\uA739\uA73B]/g},
        {'base':'ay','letters':/[\uA73D]/g},
        {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
        {'base':'dz','letters':/[\u01F3\u01C6]/g},
        {'base':'e', 'letters':/[\u20AC\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
        {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
        {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
        {'base':'hv','letters':/[\u0195]/g},
        {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
        {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
        {'base':'l', 'letters':/[\u00A1\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
        {'base':'lj','letters':/[\u01C9]/g},
        {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
        {'base':'nj','letters':/[\u01CC]/g},
        {'base':'o', 'letters':/[\u00B0\u00BA\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
        {'base':'oi','letters':/[\u01A3]/g},
        {'base':'ou','letters':/[\u0223]/g},
        {'base':'oo','letters':/[\uA74F]/g},
        {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
        {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
        {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
        {'base':'tz','letters':/[\uA729]/g},
        {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
        {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'base':'vy','letters':/[\uA761]/g},
        {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g},
        {'base':'1','letters':/[\u00B9]/g},
        {'base':'2','letters':/[\u00B2]/g},
        {'base':'tm','letters':/[\u2122]/g},
        {'base':'I','letters':/[\u00A6]/g},
        {'base':'*','letters':/[^\x00-\x7F]/g}
    ];
    var changes;
    function removeDiacriticsSource (str) {
        if(!changes) {
            changes = defaultDiacriticsRemovalMap;
        }
        // console.log('removeDiacriticsSource 1: ' + str);
        for(var i=0; i<changes.length; i++) {

            str = str.replace(changes[i].letters, changes[i].base);
        }
        //console.log('removeDiacriticsSource 2: ' + str);
        return str;
    }


    function saveToPc(data, filename) {
        console.log("MMZ saveToPc");
        if (!data) {
            console.error('No data');
            return;
        }

        if (!filename) {
            filename = 'download.json';
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data, undefined, 2);
        }

        var blob = new Blob([data], {type: 'text/json'});

        // FOR IE:

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else{
            var e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        }
    };



    return {
        getURLtransaction: function () {
            return URLtransaction;
        },
        saveToPc: function(data, filename) {
            saveToPc(data, filename)
        }
    };



});

app.controller('ViaCtrl', ['$scope', 'ViaData', function($scope, ViaData) {


}]);

app.controller('LocationImportCtrl', ['$rootScope','$scope', '$http', '$interval', 'ViaData', 'uiGridConstants', '$uibModal', 'usSpinnerService', function ($rootScope, $scope, $http, $interval, ViaData, uiGridConstants, $uibModal, usSpinnerService) {
    var vm = this;
    vm.gridOptions = {};

    // $scope.data = [];
    $scope.accountingCurrency = "USD";
    $scope.locGridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        enableGridMenu: true,
        exporterMenuPdf: false,
        onRegisterApi: function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableFiltering: true,
        enableColumnResizing: true,
        enableCellEditOnFocus: true
    };


    $scope.onkeydown = function(event) {
        //console.log('onkeydown: LocationImportCtrl');
        switch (event.keyCode){
            case 116 : //F5 button
                event.returnValue = false;
                event.keyCode = 0;
                return false;
        }

        //console.log('onkeydown', event);
    };



    $scope.locGridOptions.columnDefs = [

        { field: 'SourceLocationId', name: 'Loc Name', displayName: 'Location ID',
            cellFilter: 'limitTo : 7',
            enableFiltering: true, headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: false, width: 90 },
        { field: 'CountryCode',
            name: 'Country',
            displayName: 'Country',
            headerCellClass: $scope.highlightFilteredHeader,
            enableCellEdit: true,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'value',
            editDropdownOptionsArray: $scope.countryList,
            width: 90 },
        { field: 'StateCode',
            name: 'StateCode',
            displayName: 'State',
            visible: true,
            headerCellClass: $scope.highlightFilteredHeader,
            enableCellEdit: true,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'StateCode',
            editDropdownValueLabel: 'name',
            editDropdownOptionsArray: $scope.stateList,
            width: 60 },
        { field: 'City', name: 'City', headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 120 },
        { field: 'StreetAddress', name: 'Street Address', headerCellClass: $scope.highlightFilteredHeader, displayName: 'Address', enableCellEdit: true, width: 200 },
        { field: 'PostalCode', name: 'ZIP Code', displayName: 'ZIP Code', headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 90 },
        { field: 'TaxTerritory', name: 'tax_location_cd', displayName: 'Tax Loc. Cde.', type: 'number',
            headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 100 },
        { field: 'TaxTerritoryTx', name: 'terr_cd', displayName: 'Tax Ter.', headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 70 },
        { field: 'PdValueBaseCur', name: 'PD', displayName: 'PD', type: 'number', cellFilter: 'number: 0', footerCellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 90 },
        { field: 'BiValueBaseCur', name: 'BI', displayName: 'BI', type: 'number', footerCellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, headerCellClass: $scope.highlightFilteredHeader, cellFilter: 'number: 0', enableCellEdit: true, width: 90 },
        { field: 'TivBaseCurrency', name: 'exposure', displayName: 'TIV', type: 'number', cellFilter: 'number: 0', footerCellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true, headerCellClass: $scope.highlightFilteredHeader, enableCellEdit: true, width: 90 },
        { field: 'CRESTA', name: 'CRESTA', displayName: 'CRESTA', visible: false }, //MM Add
        { field: 'Latitude', name: 'Latitude', displayName: 'Latitude', visible: false }, //MM Add
        { field: 'Longitude', name: 'Longitude', displayName: 'Longitude', visible: false }, //MM Add
        { field: 'YearBuilt', name: 'Year Built', displayName: 'Year Built', visible: false }, //MM Add
        { field: 'NoOfStories', name: '# of Stories', displayName: '# of Stories', visible: false }, //MM Add
        { field: 'FloodZone', name: 'Flood Zone', displayName: 'Flood Zone', visible: false }, //MM Add
        { field: 'NumberLocations', name: '# of Bldgs', displayName: '# of Bldgs', visible: false }, //MM Add
        { field: 'UsStateCode', name: 'state_cd', displayName: 'state_cd', visible: false }, //MM Add
        { field: 'IsoCountryCode', name: 'country', displayName: 'country', visible: false }, //MM Add
        { field: 'ConstructionType', name: 'Construction Class', displayName: 'Construction Class', visible: false }, //MM Add
        { field: 'OccupancyCode', name: 'Occupancy Type Scheme', displayName: 'Occupancy Type Scheme', visible: false }, //MM Add
        { field: 'SurveyDate', name: 'Survey Date', displayName: 'Survey Date', visible: false }, //MM Add filler
        { field: 'SurveyType', name: 'Survey Type', displayName: 'Survey Type', visible: false }, //MM Add filler
        { field: 'RiskQuality', name: 'Risk Quality', displayName: 'Risk Quality', visible: false }, //MM Add filler
        { field: 'ProtectionClass', name: 'Protection Class', displayName: 'Protection Class', visible: false }, //MM Add filler
        { field: 'CentralStationAlarm', name: 'Central Station Alarm', displayName: 'Central Station Alarm', visible: false }, //MM Add filler
        { field: 'TerrorismDeductible', name: 'Terrorism Deductible', displayName: 'Terrorism Deductible', visible: false }, //MM Add filler
        { field: 'FloodDeductible', name: 'Flood Deductible', displayName: 'Flood Deductible', visible: false }, //MM Add filler
        { field: 'EarthquakeDeductible', name: 'Earthquake Deductible', displayName: 'Earthquake Deductible', visible: false }, //MM Add filler
        { field: 'WindstormDeductible', name: 'Windstorm Deductible', displayName: 'Windstorm Deductible', visible: false }, //MM Add filler
        { field: 'PdValueCombined', name: 'Pd Value Combined', displayName: 'Pd Value Combined', visible: false, type: 'number' }, //MM Add filler
        { field: 'PdValueContents', name: 'Pd Value Contents', displayName: 'Pd Value Contents', visible: false, type: 'number' }, //MM Add filler
        { field: 'PdValueBuildings', name: 'Pd Value Buildings', displayName: 'Pd Value Buildings', visible: false, type: 'number' }, //MM Add filler
        { field: 'ClassificationCode', name: 'Classification Code', displayName: 'Classification Code', visible: false }, //MM Add filler
        { field: 'Currency', name: 'Currency', displayName: 'Currency', visible: false }, //MM Add filler
        { field: 'Sprinklers', name: 'Sprinklers', displayName: 'Sprinklers', visible: false, type: 'number' } //MM Add filler

    ];

    $scope.countryList = [];

    /*
    $http.get('countries.json').success(function(data) {
        // $scope.countryList = data;
        $scope.locGridOptions.columnDefs[1].editDropdownOptionsArray = data;
    });

    $scope.stateList = [];
    $http.get('us-states.json').success(function(data) {
        // $scope.stateList = data;
        $scope.locGridOptions.columnDefs[2].editDropdownOptionsArray = data;
    });
    */

    locCounter = 1;

    $scope.addNew = function(locDetail){
        //$scope.data = $filter('orderBy');

        var transId = ViaData.getTransactionId();

        var newloc = {
            "SourceLocationId": "BL" + getFixedLengthNum(locCounter, 5),
            "LocationTransactionId":Number(transId),
            "CountryCode":"US",
            "PdValueBaseCur":0,
            "BiValueBaseCur":0,
            "TivBaseCurrency":0
        };

        // $scope.locGridOptions.data.push(newloc);
        var iLoc = {"locations":[newloc]};

        console.dir(iLoc);

        //$scope.saveToPc(iLoc, 'location.json')

        //MMZ Bad Mark
        //$scope.locGridOptions.data = [];



        $scope.locPromise = $http.post(ViaData.getURLlocations(), iLoc, "")
            .then(function(response) {
                $scope.getAllLocationsbyTransaction();
                //newloc.LocationId = response.data.id;
                //$scope.locGridOptions.data.push(newloc);
            });



        locCounter++;

    };

    $scope.confirmDelete = function() {
        modal = $uibModal.open({
            templateUrl: 'confirmDelete.html',
            scope: $scope,
            size: 'sm'
        });

        $scope.modalInstance = modal;
        return modal.result
    };

    $scope.clearLocations = function() {
        $scope.confirmDelete()
            .then(function(data) {
                $scope.deleteLocations();
                ViaData.setLocFilters([]);
            })
            .then(null, function(reason) {
                //$scope.handleDismiss(reason);
            });
    };

    $scope.ok = function() {
        $scope.data = [];
        ViaData.setLocations($scope.data);
        locCounter = 1;
        $scope.modalInstance.close('Yes Button Clicked')
    };

    $scope.cancel = function() {
        $scope.modalInstance.dismiss('No Button Clicked')
    };


    $scope.getAllLocationsbyTransaction = function() {

        console.log("get All Locations by Transaction");
        var transId = ViaData.getTransactionId();

        $scope.data = [];
        $rootScope.locFilterGridOptions.data = [];
        $scope.locGridOptions.data = [];

        $scope.locPromise = $http.get(ViaData.getURLlocations() + '/' + transId, "").then(function(response) {
            console.dir(response.data);
            //ViaData.saveToPc(response.data, 'afterlocations.json')
            for (var i = 0; i < response.data.locations.length; i++) {
                $scope.locGridOptions.data.push(RestLocationToGridLocation(response.data.locations[i], transId, response.data.locations[i].LocationId));
                $rootScope.locFilterGridOptions.data.push(RestLocationToGridLocation(response.data.locations[i], transId, response.data.locations[i].LocationId));
            }
        });

        ViaData.setLocations($scope.locGridOptions.data);

    };


    $scope.deleteLocations = function() {
        console.log("generate Location All");

        var transId = ViaData.getTransactionId();

        if (transId) {
            var locationsread = $scope.locGridOptions.data;
            $scope.locGridOptions.data = [];
            $rootScope.locFilterGridOptions.data = [];
            console.log("locationsread");
            console.dir(locationsread);


            for (var i = 0; i < locationsread.length; i++) {
                var locations = [];
                var temploc = locationsread[i];
                var existing = false;
                var tempLocationId = '';

                if (temploc.LocationId) {
                    console.log('Existing:' + temploc.LocationId);
                    existing = true;
                    tempLocationId = temploc.LocationId;
                }

                if (existing) {
                    console.log(ViaData.getURLlocations() + '/' + transId + '/' + tempLocationId);
                    $scope.locPromise = $http.delete(ViaData.getURLlocations() + '/' + transId + '/' + tempLocationId, "").then(function(response) {
                        //console.log("MMZ delete");
                        //console.dir(response.data);

                        var holdingResponse = response.data;
                    });
                }
            }
        } else {
            console.log("No Transaction");
        }
    };

    $scope.generateLocations = function() {
        console.log("generate Location All");
        var transId = ViaData.getTransactionId();



        if (transId) {
            var locationsread = $scope.locGridOptions.data;
            $scope.locGridOptions.data = [];
            $rootScope.locFilterGridOptions.data = [];
            console.log("locationsread");
            console.dir(locationsread);

            var locations = [];
            var locationsAddress = [];

            for (var i = 0; i < locationsread.length; i++) {
                var coverage = GridLocationToRestLocation(locationsread[i], transId);
                locations.push(coverage);
                locationsAddress.push(GetAddressandCity(locationsread[i], transId))

            }

            if (locations.length) {
                //console.log("MMZ 01");
                var iLoc = {"locations":locations};
                var coverageTemp = coverage;

                console.log("MMZ post Data b");
                //ViaData.saveToPc(iLoc, 'beforelocations.json')
                //console.dir(iLoc);
                //$scope.saveToPc(iLoc, 'locations.json')
                //$scope.saveToPc(locationsAddress, 'address.json')

                $scope.locPromise = $http.post(ViaData.getURLlocations(), iLoc, "").then(function(response) {
                    //console.log("MMZ Post");
                    //console.dir(response);
                    $scope.getAllLocationsbyTransaction();
                });
                /*
                 .then(function(response) {
                 $scope.getAllLocationsbyTransaction();
                 });*/
            }

        } else {
            console.log("No Transaction");
        }
    };

    function GetAddressandCity(temploc, transId) {
        //console.log("GridLocationToRestLocation 1:");
        //console.dir(temploc);

        var PdValueBuildings = 0;
        if(!isNaN(temploc.PdValueBuildings)) { var PdValueBuildings = Number(temploc.PdValueBuildings)};

        var PdValueContents = 0;
        if(!isNaN(temploc.PdValueContents)) { var PdValueContents = Number(temploc.PdValueContents)};

        var PdValueCombined = 0;
        if(!isNaN(temploc.PdValueCombined)) { var PdValueCombined = Number(temploc.PdValueCombined)};

        var PdValueBaseCur = 0;
        if(!isNaN(temploc.PdValueBaseCur)) { var PdValueBaseCur = Number(temploc.PdValueBaseCur)};

        var BiValueBaseCur = 0;
        if(!isNaN(temploc.BiValueBaseCur)) { var BiValueBaseCur = Number(temploc.BiValueBaseCur)};

        var TivBaseCurrency = 0;
        if(!isNaN(temploc.TivBaseCurrency)) { var TivBaseCurrency = Number(temploc.TivBaseCurrency)};

        var WindstormDeductible = 0;
        if(!isNaN(temploc.WindstormDeductible)) { var WindstormDeductible = Number(temploc.WindstormDeductible)};

        var EarthquakeDeductible = 0;
        if(!isNaN(temploc.EarthquakeDeductible)) { var EarthquakeDeductible = Number(temploc.EarthquakeDeductible)};

        var FloodDeductible = 0;
        if(!isNaN(temploc.FloodDeductible)) { var FloodDeductible = Number(temploc.FloodDeductible)};

        var TerrorismDeductible = 0;
        if(!isNaN(temploc.TerrorismDeductible)) { var TerrorismDeductible = Number(temploc.TerrorismDeductible)};

        var Sprinklers = 0;
        if(!isNaN(temploc.Sprinklers)) { var Sprinklers = Number(temploc.Sprinklers)};


        var CentralStationAlarm = '';
        if(temploc.CentralStationAlarm != undefined) { var CentralStationAlarm = temploc.CentralStationAlarm};

        var ClassificationCode = '';
        if(temploc.ClassificationCode != undefined) { var ClassificationCode = temploc.ClassificationCode};

        var RiskQuality = '';
        if(temploc.RiskQuality != undefined) { var RiskQuality = temploc.RiskQuality};

        var SurveyType = '';
        if(temploc.SurveyType != undefined) { var SurveyType = temploc.SurveyType};


        var SurveyDate = '';
        if(temploc.SurveyDate != undefined) { var SurveyDate = temploc.SurveyDate};

        var ProtectionClass = '';
        if(temploc.ProtectionClass != undefined) { var ProtectionClass = temploc.ProtectionClass};

        var Currency = $scope.accountingCurrency;
        if(temploc.Currency != undefined) { var Currency = temploc.Currency};


        var TaxTerritory = String(temploc.TaxTerritory);
        if(temploc.TaxTerritory == undefined | temploc.TaxTerritory == '') { var TaxTerritory = temploc.TaxTerritoryTx};
        if(TaxTerritory == undefined) { var TaxTerritory = ''};

        //console.log("TaxTerritory 1:" + TaxTerritory);

        var CRESTA = '';
        if(temploc.CRESTA != undefined) { var CRESTA = temploc.CRESTA};

        var City = '';
        if(temploc.City != undefined) { var City = temploc.City};

        var ConstructionType = '';
        if(temploc.CConstructionTypeity != undefined) { var ConstructionType = temploc.ConstructionType};

        var CountryCode = '';
        if(temploc.CountryCode != undefined) { var CountryCode = temploc.CountryCode};

        var FloodZone = '';
        if(temploc.FloodZone != undefined) { var FloodZone = temploc.FloodZone};

        var IsoCountryCode = '';
        if(temploc.IsoCountryCode != undefined) { var IsoCountryCode = temploc.IsoCountryCode};

        var Longitude = '';
        if(temploc.Longitude != undefined) { var Longitude = temploc.Longitude};

        var Latitude = '';
        if(temploc.Latitude != undefined) { var Latitude = temploc.Latitude};

        var NumberLocations = '';
        if(temploc.NumberLocations != undefined) { var NumberLocations = temploc.NumberLocations};

        var NoOfStories = '';
        if(temploc.NoOfStories != undefined) { var NoOfStories = temploc.NoOfStories};

        var OccupancyCode = '';
        if(temploc.OccupancyCode != undefined) { var OccupancyCode = temploc.OccupancyCode};

        var StateCode = '';
        if(temploc.StateCode != undefined) { var StateCode = temploc.StateCode};

        var StreetAddress = '';
        if(temploc.StreetAddress != undefined) { var StreetAddress = temploc.StreetAddress};

        var UsStateCode = '';
        if(temploc.UsStateCode != undefined) { var UsStateCode = temploc.UsStateCode};

        var YearBuilt = '';
        if(temploc.YearBuilt != undefined) { var YearBuilt = temploc.YearBuilt};

        var location = {
            "StreetAddress": ViaData.removeDiacritics(StreetAddress),
            "City": ViaData.removeDiacritics(City),
        };



        //console.log("GridLocationToRestLocation 2:");
        return location;
    }

    function GridLocationToRestLocation(temploc, transId) {
        //console.log("GridLocationToRestLocation 1:");
        //console.dir(temploc);

        var PdValueBuildings = 0;
        if(!isNaN(temploc.PdValueBuildings)) { var PdValueBuildings = Number(temploc.PdValueBuildings)};

        var PdValueContents = 0;
        if(!isNaN(temploc.PdValueContents)) { var PdValueContents = Number(temploc.PdValueContents)};

        var PdValueCombined = 0;
        if(!isNaN(temploc.PdValueCombined)) { var PdValueCombined = Number(temploc.PdValueCombined)};

        var PdValueBaseCur = 0;
        if(!isNaN(temploc.PdValueBaseCur)) { var PdValueBaseCur = Number(temploc.PdValueBaseCur)};

        var BiValueBaseCur = 0;
        if(!isNaN(temploc.BiValueBaseCur)) { var BiValueBaseCur = Number(temploc.BiValueBaseCur)};

        var TivBaseCurrency = 0;
        if(!isNaN(temploc.TivBaseCurrency)) { var TivBaseCurrency = Number(temploc.TivBaseCurrency)};

        var WindstormDeductible = 0;
        if(!isNaN(temploc.WindstormDeductible)) { var WindstormDeductible = Number(temploc.WindstormDeductible)};

        var EarthquakeDeductible = 0;
        if(!isNaN(temploc.EarthquakeDeductible)) { var EarthquakeDeductible = Number(temploc.EarthquakeDeductible)};

        var FloodDeductible = 0;
        if(!isNaN(temploc.FloodDeductible)) { var FloodDeductible = Number(temploc.FloodDeductible)};

        var TerrorismDeductible = 0;
        if(!isNaN(temploc.TerrorismDeductible)) { var TerrorismDeductible = Number(temploc.TerrorismDeductible)};

        var Sprinklers = 0;
        if(!isNaN(temploc.Sprinklers)) { var Sprinklers = Number(temploc.Sprinklers)};


        var CentralStationAlarm = '';
        if(temploc.CentralStationAlarm != undefined) { var CentralStationAlarm = temploc.CentralStationAlarm};

        var ClassificationCode = '';
        if(temploc.ClassificationCode != undefined) { var ClassificationCode = temploc.ClassificationCode};

        var RiskQuality = '';
        if(temploc.RiskQuality != undefined) { var RiskQuality = temploc.RiskQuality};

        var SurveyType = '';
        if(temploc.SurveyType != undefined) { var SurveyType = temploc.SurveyType};


        var SurveyDate = '';
        if(temploc.SurveyDate != undefined) { var SurveyDate = temploc.SurveyDate};

        var ProtectionClass = '';
        if(temploc.ProtectionClass != undefined) { var ProtectionClass = temploc.ProtectionClass};

        var Currency = $scope.accountingCurrency;
        if(temploc.Currency != undefined) { var Currency = temploc.Currency};


        var TaxTerritory = String(temploc.TaxTerritory);
        if(temploc.TaxTerritory == undefined | temploc.TaxTerritory == '') { var TaxTerritory = temploc.TaxTerritoryTx};
        if(TaxTerritory == undefined) { var TaxTerritory = ''};

        //console.log("TaxTerritory 1:" + TaxTerritory);

        var CRESTA = '';
        if(temploc.CRESTA != undefined) { var CRESTA = temploc.CRESTA};

        var City = '';
        if(temploc.City != undefined) { var City = temploc.City};

        var ConstructionType = '';
        if(temploc.CConstructionTypeity != undefined) { var ConstructionType = temploc.ConstructionType};

        var CountryCode = '';
        if(temploc.CountryCode != undefined) { var CountryCode = temploc.CountryCode};

        var FloodZone = '';
        if(temploc.FloodZone != undefined) { var FloodZone = temploc.FloodZone};

        var IsoCountryCode = '';
        if(temploc.IsoCountryCode != undefined) { var IsoCountryCode = temploc.IsoCountryCode};

        var Longitude = '';
        if(temploc.Longitude != undefined) { var Longitude = temploc.Longitude};

        var Latitude = '';
        if(temploc.Latitude != undefined) { var Latitude = temploc.Latitude};

        var NumberLocations = '';
        if(temploc.NumberLocations != undefined) { var NumberLocations = temploc.NumberLocations};

        var NoOfStories = '';
        if(temploc.NoOfStories != undefined) { var NoOfStories = temploc.NoOfStories};

        var OccupancyCode = '';
        if(temploc.OccupancyCode != undefined) { var OccupancyCode = temploc.OccupancyCode};

        var StateCode = '';
        if(temploc.StateCode != undefined) { var StateCode = temploc.StateCode};

        var StreetAddress = '';
        if(temploc.StreetAddress != undefined) { var StreetAddress = temploc.StreetAddress};

        var UsStateCode = '';
        if(temploc.UsStateCode != undefined) { var UsStateCode = temploc.UsStateCode};

        var YearBuilt = '';
        if(temploc.YearBuilt != undefined) { var YearBuilt = temploc.YearBuilt};

        var location = {
            "LocationTransactionId": Number(transId),
            "SourceLocationId": temploc.SourceLocationId,
            "StreetAddress": ViaData.removeDiacritics(StreetAddress),
            "City": ViaData.removeDiacritics(City),
            "Region": StateCode,
            "CRESTA": CRESTA,
            "PostalCode": String(temploc.PostalCode),
            "CountryName": CountryCode,
            "Latitude": Latitude,
            "Longitude": Longitude,
            "OccupancyCode": OccupancyCode,
            "ConstructionType": ConstructionType,
            "YearBuilt": YearBuilt,
            "NumberStories": NoOfStories,
            "NumberLocations": NumberLocations,
            "Currency": Currency,
            "PdValueBuildings": PdValueBuildings,
            "PdValueContents": PdValueContents,
            "PdValueCombined": PdValueCombined,
            "PdValue": PdValueBaseCur,
            "BiValue": BiValueBaseCur,
            "TivBaseCur": TivBaseCurrency,
            "WindstormDeductible": WindstormDeductible,
            "EarthquakeDeductible": EarthquakeDeductible,
            "FloodDeductible": FloodDeductible,
            "TerrorismDeductible": TerrorismDeductible,  //MM dont know where this comes from
            "Sprinklers": Sprinklers,
            "CentralStationAlarm": CentralStationAlarm,
            "ProtectionClass": ProtectionClass,
            "FloodZone": FloodZone,
            "RiskQuality": RiskQuality,
            "SurveyType": SurveyType,
            "SurveyDate": SurveyDate,
            "ClassificationCode": ClassificationCode,
            "IsoCountryCode": IsoCountryCode,
            "UsStateCode": UsStateCode,
            "TaxTerritory": TaxTerritory
        };

        if  (temploc.LocationId) {
            location.LocationId =  Number(temploc.LocationId);
        }


        //console.log("GridLocationToRestLocation 2:");
        // console.dir(location);
        return location;
    }

    function RestLocationToGridLocation(temploc, transId, LocationId ) {
        //console.log("RestLocationToGridLocation 1:");
        //console.dir(temploc);

        var location = {
            "LocationTransactionId": Number(transId),
            "LocationId": LocationId,
            "SourceLocationId": temploc.SourceLocationId,
            "StreetAddress": temploc.StreetAddress,
            "City": temploc.City,
            "StateCode": temploc.Region,
            "CRESTA": temploc.CRESTA,
            "PostalCode": temploc.PostalCode,
            "CountryCode": temploc.CountryName,
            "Latitude": temploc.Latitude,
            "Longitude": temploc.Longitude,
            "OccupancyCode": temploc.OccupancyCode,
            "ConstructionType": temploc.ConstructionType,
            "YearBuilt": temploc.YearBuilt,
            "NoOfStories": temploc.NumberStories,
            "NumberLocations": temploc.NumberLocations,
            "Currency": temploc.Currency,
            "PdValueBuildings": Number(temploc.PdValueBuildings),
            "PdValueContents": Number(temploc.PdValueContents),
            "PdValueCombined": Number(temploc.PdValueCombined),
            "PdValueBaseCur": Number(temploc.PdValue),
            "BiValueBaseCur": Number(temploc.BiValue),
            "WindstormDeductible": Number(temploc.WindstormDeductible),
            "EarthquakeDeductible": Number(temploc.EarthquakeDeductible),
            "FloodDeductible": Number(temploc.FloodDeductible),
            "TerrorismDeductible": Number(temploc.TerrorismDeductible),  //MM dont know where this comes from
            "Sprinklers": Number(temploc.Sprinklers),
            "CentralStationAlarm": temploc.CentralStationAlarm,
            "ProtectionClass": temploc.ProtectionClass,  //MM dont know where this comes from
            "FloodZone": temploc.FloodZone,
            "RiskQuality": temploc.RiskQuality,  //MM dont know where this comes from
            "SurveyType": temploc.SurveyType, //MM dont know where this comes from
            "SurveyDate": temploc.SurveyDate, //MM dont know where this comes from
            "ClassificationCode": temploc.ClassificationCode,
            "IsoCountryCode": temploc.IsoCountryCode,
            "UsStateCode": temploc.UsStateCode,
            "TaxTerritory": temploc.TaxTerritory,
            "TivBaseCurrency": Number(temploc.TivBaseCur)
        };

        //console.log("RestLocationToGridLocation 2:");
        //console.dir(location);
        return location;
    }


    $scope.startcounter = 0;
    $scope.startSpin = function() {
        if (!$scope.spinneractive) {
            usSpinnerService.spin('spinner-1');
            $scope.startcounter++;
        }
    };

    $scope.stopSpin = function() {
        if ($scope.spinneractive) {
            usSpinnerService.stop('spinner-1');
        }
    };
    $scope.spinneractive = false;

    $rootScope.$on('us-spinner:spin', function(event, key) {
        $scope.spinneractive = true;
    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
        $scope.spinneractive = false;
    });

    $scope.$on('locationFileLoaded', function() {
        $scope.startSpin()
        console.log('locationFileLoaded');
        $scope.generateLocations();
        $scope.stopSpin()
    });

    $scope.$on('uiGridEventEndCellEdit', function (event) {
        console.log('uiGridEventEndCellEdit');
        console.dir(event.targetScope.row.entity);
        var transId = ViaData.getTransactionId();
        var locations = [];
        locations.push(GridLocationToRestLocation(event.targetScope.row.entity, transId))
        var iLoc = {"locations":locations};

        console.log(ViaData.getURLlocations() + '/' + transId + '/' + event.targetScope.row.entity.LocationId);
        console.dir(iLoc);
        //ViaData.saveToPc(iLoc, 'put.json')


        $scope.locPromise = $http.put(ViaData.getURLlocations() + '/' + transId + '/' + event.targetScope.row.entity.LocationId, iLoc, "").then(function(response) {
            console.dir(response.data);
            console.log("MMZ put");
            var holdingResponse = response.data;
            //ViaData.setLocations($scope.locGridOptions.data);
            $rootScope.locFilterGridOptions.data = $scope.locGridOptions.data;
        });
    });

}]);



app.directive("fileread", ['$uibModal','ViaData', 'usSpinnerService', function ($uibModal,ViaData,usSpinnerService) {





    return {
        scope: {
            opts: '='
        },
        link: function ($scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function () {

                        function fixdata(data) {
                            var o = "", l = 0, w = 10240;
                            for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
                            o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
                            return o;
                        }

                        $scope.ImportLocationToGridLocation = function(temploc) {
                            var location = {
                                "LocationTransactionId": 0,
                                "LocationId": 0,
                                "SourceLocationId": temploc["Loc Name"],
                                "StreetAddress": temploc["Street Address"].replace(/'/g , ""),
                                "City": temploc["City"].replace(/'/g , ""),
                                "StateCode": temploc["state_cd"],
                                "CRESTA": temploc["CRESTA"],
                                "PostalCode": "", // temploc["ZIP Code"],
                                "CountryCode": temploc["Country"],
                                "Latitude": temploc["Landslide"],
                                "Longitude": temploc["Longitude"],
                                "OccupancyCode": temploc["Occupancy Type Scheme"],
                                "ConstructionType": temploc["Construction Class Scheme"],
                                "YearBuilt": temploc["Year Built"],
                                "NoOfStories": temploc["# of Stories"],
                                "NumberLocations": temploc["# of Bldgs"],
                                "PdValueBaseCur": Number(temploc["PD"].replace(/,/g , "").replace(/\s/g, "")),
                                "BiValueBaseCur": Number(temploc["BI"].replace(/,/g , "").replace(/\s/g, "")),
                                "FloodZone": temploc["Flood Zone"],
                                "IsoCountryCode": temploc["Country"],
                                "UsStateCode": temploc["state_cd"],
                                "TaxTerritory": temploc["tax_location_cd"],
                                "TaxTerritorytx": Number(temploc["terr_cd"]),
                                "TivBaseCurrency": Number(temploc["exposure"].replace(/,/g , "").replace(/\s/g, ""))
                            };
                            //console.log("ImportLocationToGridLocation 2:");
                            // console.dir(location);
                            return location;
                        }

                        var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
                        var data = evt.target.result;

                        var workbook;
                        if(rABS) {
                            workbook = XLSX.read(data, {type: 'binary'});
                        } else {
                            var arr = fixdata(data);
                            workbook = XLSX.read(btoa(arr), {type: 'base64'});
                        }

                        //var workbook = XLSX.read(wb, {type: 'binary'});

                        $scope.options = workbook.SheetNames;
                        console.log("Options 1:");
                        console.dir($scope.options);
                        $scope.chosenOption = ""; // default



                        //$scope.stopSpin();
                        $scope.confirmSheet = function() {
                            modal = $uibModal.open({
                                templateUrl: 'confirmSheet.html',
                                scope: $scope,
                                size: 'sm'
                            });

                            $scope.modalInstance = modal;
                            return modal.result
                        };


                        $scope.confirmSheet()
                            .then(function(data) {
                                console.log("Close sheet pick 1:" + data.length);
                                console.dir(data);

                                //$scope.startSpin();
                                //$scope.handleSuccess(data);

                                //var headerNames = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];


                                //var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
                                var data = XLSX.utils.sheet_to_json( workbook.Sheets[data]);

                                $scope.opts.data = [];

                                data.forEach(function (h) {
                                    $scope.opts.data.push($scope.ImportLocationToGridLocation(h));
                                });

                                //$scope.opts.data.push(data);

                                console.log("File Read 1:" + $scope.opts.data.length);
                                //console.dir(data);



                                ViaData.setLocations($scope.opts.data);

                                console.log("File Read 2a:");
                                console.dir(ViaData.getLocations());

                                //$scope.opts.data = data;

                                console.log("File Read 2b:");
                                console.dir($scope.opts.data);



                                console.log("File Read 3:");
                                console.dir($scope.opts);

                                $scope.$emit('locationFileLoaded');
                                //$scope.stopSpin();
                                $elm.val(null);


                            })
                            .then(null, function(reason) {
                                //$scope.handleDismiss(reason);
                            });

                        $scope.ok = function(slectedOption) {
                            $scope.modalInstance.close(slectedOption)
                        };

                        $scope.cancel = function() {
                            //$scope.modalInstance.dismiss('No Button Clicked')
                        };




                    });
                };

                var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
                if(rABS) reader.readAsBinaryString(changeEvent.target.files[0]);
                else reader.readAsArrayBuffer(changeEvent.target.files[0]);
            });



        }
    }
}]);