var LgTv = require('./Lg.js').server;

var lgTv = new LgTv('192.168.0.24', 37904);

lgTv.stream({
    title: 'Test',
    url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg',
    duration : '0:02:50.000'
});