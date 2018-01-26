const Botkit		= require( './lib/Botkit.js' );
const FeedParser	= require( 'feedparser' );
const Request		= require( 'request' );
const Utillity		= require( 'util' );
const targetURL		= {
	"dothtml5"	: "https://dothtml5.com/feed.xml"
};
const rssGetMessage	= [
	'RSS (.*)'	,
	'今日の記事 (.*)'
];

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: 'xoxb-306109262583-yjl9Zj1TDX5jMuBBCFQ9ZWAx'
}).startRTM();

controller.hears( rssGetMessage , 'direct_message , direct_mention , mention', function( bot , message ) {
	var target		= message.match[ 1 ].toLowerCase();
	var feedParser	= new FeedParser({});
	var rssItems	= [];
	var today		= new Date();

	if( target == "dothtml5" ) {
		var rssRequest	= Request( targetURL[ target ] );
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
						bot.reply( message, Utillity.format( 'today is news entry link is : %s' , item.origlink ) );
					}
			});
		});
	}

});
