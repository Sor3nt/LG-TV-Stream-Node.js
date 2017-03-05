/**
 * LG TV Stream for Node.js
 * Feel free to spend me a beer for this work <paypal:sor3nt@gmail.com>, thank you!
 *
 * A simple Node.js Module that allows to stream a video to "any" LG TV device.
 *
 * Usage:
 *
 * var LgTv = require('./Lg.js').server;
 * var lgTv = new LgTv('192.168.0.24', 37904);
 * lgTv.stream({
 *  title: 'Test',
 *  url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
 *  poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg',
 *  duration : '0:02:50.000'
 * });
 */
var net = require('net');
module.exports.server = function( ip, port ){

    var self = {
        _client: false,

        _init: function () {
            self._client = new net.Socket();
            self._client.connect(port, ip, function() {
                console.log('[LGTV] Connecting...');
            });

            self._client.on('data', function(data) {
                console.log('[LGTV] Connected!');
                console.log('[LGTV] Send Video...');
                self._startStream();
                self._client.destroy();
            });

            self._client.on('error', function() {
                self._state = 'error';
                console.log('[LGTV] Error');
            });

            self._client.on('close', function() {
                console.log('[LGTV] Connection closed');
            });
        },

        _request: function ( command, xml ) {

            var request =
                    "POST /upnp/control/AVTransport1 HTTP/1.1\r\n" +
                    "Soapaction: \"urn:schemas-upnp-org:service:AVTransport:1#" + command + "\"\r\n" +
                    "Content-type: text/xml;charset=utf-8\r\n" +
                    "Content-Length: " + xml.length + "\r\n" +
                    "Host: " + ip + ":" + port + "\r\n" +
                    "Connection: Keep-Alive\r\n" +
                    "User-Agent: Android/7.1.1 UPnP/1.0 BubbleUPnP/2.8.7\r\n" +
                    "\r\n" +

                    xml + "\r\n"
                ;

            self._client.write(new Buffer(request));
        },


        _startStream: function () {

            var xml =
                    '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
                    '<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
                    '<s:Body>' +
                    '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">' +
                    '<InstanceID>0</InstanceID>' +
                    '<Speed>1</Speed>' +
                    '</u:Play>' +
                    '</s:Body>' +
                    '</s:Envelope>'
                ;

            self._request('Play', xml);
        },

        stream: function ( options ) {
            
            var xml =
                '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
                '<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">' +
                    '<s:Body>' +
                        '<u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">' +
                            '<InstanceID>0</InstanceID>' +
                            '<CurrentURI>' + options.url + '</CurrentURI>' +
                            '<CurrentURIMetaData>' +
                                '&lt;DIDL-Lite xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/" xmlns:sec="http://www.sec.co.kr/" xmlns:pv="http://www.pv.com/pvns/"&gt;' +
                                '&lt;item id="/external/video/media/all_videos/829" parentID="/external/video/media/all_videos" restricted="1"&gt;' +
                                '&lt;upnp:class&gt;' +
                                'object.item.videoItem&lt;/upnp:class&gt;' +
                                '&lt;dc:title&gt;' + options.title + '&lt;/dc:title&gt;' +
                                '&lt;dc:creator&gt;' +
                                '&amp;lt;unknown&amp;gt;' +
                                '&lt;/dc:creator&gt;' +
                                '&lt;upnp:artist&gt;' +
                                '&amp;lt;unknown&amp;gt;' +
                                '&lt;/upnp:artist&gt;' +
                                '&lt;upnp:albumArtURI&gt;' +
                                options.poster + '&lt;/upnp:albumArtURI&gt;' +
                                '&lt;res protocolInfo="http-get:*:video/mp4:DLNA.ORG_PN=AVC_MP4_BL_L3L_SD_AAC;DLNA.ORG_OP=01;DLNA.ORG_FLAGS=01700000000000000000000000000000" size="15733726" duration="' + options.duration + '"&gt;' +
                                options.url + '&lt;/res&gt;' +
                                '&lt;/item&gt;' +
                                '&lt;/DIDL-Lite&gt;' +
                            '</CurrentURIMetaData>' +
                        '</u:SetAVTransportURI>' +
                    '</s:Body>' +
                '</s:Envelope>';

            self._request('SetAVTransportURI', xml);

            var request =
                "POST /upnp/control/AVTransport1 HTTP/1.1\r\n" + 
                "Soapaction: \"urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI\"\r\n" +
                "Content-type: text/xml;charset=utf-8\r\n" +
                "Content-Length: " + xml.length + "\r\n" +
                "Host: " + ip + ":" + port + "\r\n" +
                "Connection: Keep-Alive\r\n" +
                "User-Agent: Android/7.1.1 UPnP/1.0 BubbleUPnP/2.8.7\r\n" +
                "\r\n" +

                xml + "\r\n"
            ;

            self._client.write(new Buffer(request));
        }
    };

    self._init();

    return {
        stream: self.stream
    };
};
