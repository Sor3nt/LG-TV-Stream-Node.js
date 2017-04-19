# LG TV Stream for Node.js
A simple Node.js Module that allows to stream a video to "any" LG TV device.

 Feel free to spend me a beer for this work over Paypal sor3nt@gmail.com, thank you!

## How to use:

Include the library:
```
var LgTv = require('./Lg.js').server;

```

Create a new instance
```
var lgTv = new LgTv('192.168.0.24', 37904);
```

Start the Stream
```
lgTv.stream({
    title: 'Test',
    url : 'http://dl2.mihanpix.com/Film/2016/Barbershop.The.Next.Cut.2016.720p.Ozlem.mp4',
    // the poster is not needed but must be set
    poster: 'http://192.168.0.39:57645/external/video/thumbnails/6744.jpg',
    // the duration need to match the movie length otherwise it will stop at the given position
    duration : '0:02:50.000'
});
```
