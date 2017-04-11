//links
var cols = {
  about:{
    index: 0,
    title: "about",
    icon: "info",
    items:[
      {
        href:window.location.origin+'/about',
        icon:'info_outline',
        title:'About'
      },
    ]
  },
  music:{
    index: 1,
    title: "music",
    icon: "play_circle_filled",
    items:[
      {
        href:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/179666085%3Fsecret_token%3Ds-z3byT&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
        icon:'music_note',
        title:'Chiptune Music'
      },
      {
        href:"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/179665508%3Fsecret_token%3Ds-zMDjT&amp;auto_play=true&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true",
        icon:'music_note',
        title:'Ambient Music'
      }
    ]
  },
  misc:{
    index:2,
    title:"misc",
    icon:"more",
    items:[
      {
        href:window.location.origin+"/blog",
        icon:'book',
        title:'Blog'
      },
      {
        href:window.location.origin+"/window",
        icon:'wb_cloudy',
        title:'Weather'
      },
      {
        href:window.location.origin+'/calculator',
        icon:'add',
        title:'Calculator'
      },
    ]
  },
  games:{
    index:3,
    title:"games",
    icon:"games",
    items:[
      {
        href:window.location.origin+"/duckgame",
        iconUrl:'../img/duckicon.png',
        title:'Jump, Duck!',
        subtitle:'Made with Three.js'
      },
      {
        href:window.location.origin+"/bathroomdash_min",
        iconUrl:'../img/bd.png',
        title:'Bathroom Dash',
        subtitle:'Made for MiniLD65 using Unity3D'
      },
      {
        href:window.location.origin+"/ld35_min",
        iconUrl:'../img/chicken.png',
        title:'Chicken Shift',
        subtitle:'Made for LD35 using Unity3D'
      }
    ]
  },
  projects:{
    index:4,
    title:"projects",
    icon:"code",
    items:[
      {
        href:window.location.origin+"/markdown?mdsrc=https://cdn.rawgit.com/fenwick67/node-ez-tv/master/README.md",
        icon:'tv',
        title:'EZ-TV'
      },
      {
        href:window.location.origin+"/models",
        icon:'3d_rotation',
        title:'Models'
      }
    ]
  }
}

exports.columns = cols;
