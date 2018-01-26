const FeedParser	= require( 'feedparser' );
const Request		= require( 'request' );
const Utillity		= require( 'util' );
const targetURL		= "https://dothtml5.com/feed.xml";

var rssRequest	= Request( targetURL );
var feedParser	= new FeedParser({});
var rssItems	= [];
var today		= new Date();

rssRequest.on( 'response' , function ( responce ) {
	this.pipe( feedParser );
});

feedParser.on( 'readable' , function() {
	while( item = this.read() ) {
		//console.log( JSON.stringify( item ) );
		rssItems.push( item );
	}
});
feedParser.on( 'end' , function() {
	rssItems.forEach( function( item ) {
		var date	= new Date( item.date );
		console.log( Utillity.format( '【%s】[%d/%d/%d]' , item.title , date.getFullYear() , date.getMonth() + 1 , date.getDate() ) );

		if( ( date.getFullYear()	=== today.getFullYear()	) &&
			( date.getMonth()		=== today.getMonth()	) &&
			( date.getDate()		=== today.getDate()		) ) {
				console.log( JSON.stringify( item ) );
				console.log( Utillity.format( 'target link is : %s' , item.origlink ) );
			}
	});
});