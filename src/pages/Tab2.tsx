import { Plugins } from '@capacitor/core';


import React, {  useEffect, useState }  from 'react';
import { IonBadge, IonCardHeader, IonCard, useIonViewWillEnter, useIonViewDidEnter, IonRow, IonCol, IonGrid, IonIcon, IonText, IonAlert, IonButton, IonList,IonInput, IonLabel,IonItem,  IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { trash } from 'ionicons/icons';
import ipfsClient from 'ipfs-http-client';

//import { CID } from 'ipfs-http-client';

import './Tab2.css';
import configdata from './config.json';


const { Storage } = Plugins;

const Tab2: React.FC = () =>  {
  const [userid, setUserid] = useState('');
  const [nodetype, setNodetype] = useState('');
  const [localgateway, setLocalgateway] = useState('');
  const [dirtomake, setDirtomake] = useState('');
  const [filehash, setFilehash] = useState('');
  const [filename, setFilename] = useState('');
  const [usagelimit, setUsagelimit] = useState(0);
  const [directory, setDirectory] = useState('/user1/contents/');
  const [remotedirectory, setRemoteDirectory] = useState('/user1/contents/');
  const [workingnode, setWorkingnode] = useState('');

  const [mylistnodes, setMylistnodes] = React.useState([]);

  const [statvalue, setStatvalue] = useState(0);
  const [mylist, setMylist] = React.useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showMessageAlert, setShowMessageAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [remoteactive, setRemoteactive] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginmessage, setLoginmessage] = useState('');

  const [mysegments, setMysegments] = React.useState([]);
  const [myremotesegments, setMyremotesegments] = React.useState([]);


  //const mylist1: any[] = [];

 const trashicon = trash;

  // const serverurl = "http://157.245.63.46:8080";
// const serverurl = "http://172.31.5.90:1337";
const serverurl = configdata.sailsurl;

  var ipfs = ipfsClient(configdata.apilink) ;


//   const serverurl = "http://157.245.63.46:1337";


//  const ipfs = ipfsClient('/ip4/157.245.63.46/tcp/5001')


  var ipfsconfig : any = {
	nodetype : '',
	userid : ''
  };
 
 useIonViewDidEnter(() => {
    console.log('ionViewDidEnter event fired')
  });

  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');

    var tmptoken = localStorage.getItem("token");
    var tuserinfo = localStorage.getItem('userinfo') as any;
    var userinfo = null as any;

    if(tmptoken == null) 
    {
      setLoginmessage("Login to proceed");
      setShowLoginAlert(true); 
      return;
    }

    console.log("userinfo="+ tuserinfo);
    try {
      userinfo = JSON.parse(tuserinfo);
    } catch(err)   {
     return;
    };

    if(userinfo)
    {
        console.log(tuserinfo);
//        setUsername(userinfo.username);
        setUserid(userinfo.userid);
//        setEmail(userinfo.email);
    }

    if(userid !== '') {
      getconfig();
    }

    var tmpipfs = localStorage.getItem("ipfsconfig");



    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);

    }else {
      setLoginmessage("Config not created");
      setShowLoginAlert(true); 
      return;

    }

    setUserid(ipfsconfig.userid);
    setNodetype(ipfsconfig.nodetype);
    setLocalgateway(ipfsconfig.localgateway);
    setUsagelimit(ipfsconfig.usagelimit);
    checkandcreatedir('/'+ ipfsconfig.userid);

    listNewDirectory('/'+ ipfsconfig.userid);
    liststat('/'+ ipfsconfig.userid);
  });

  const selectnode = async (node) => {

        getremotenodedata(node) ;
        setWorkingnode(node.nodeid);
        setRemoteactive(true);
        listNewRemoteDirectory('/'+ node.userid);
        setMessage("Selected "+ workingnode);
        setShowMessageAlert(true);
  };

   const getremotenodedata = async (x) => {
    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }


  var url = serverurl + "/api/nodeoperation/getnodedata";
   var cred = {
        userid: ipfsconfig.userid,
         nodeid:x.nodeid,
        nodename:x.nodename,
        nodegroup:x.nodegroup,

   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         if( res && !res.response ) {
         localStorage.setItem("remotenodeselected", JSON.stringify(res) );
         }else {
          console.log(res);
         }

        },
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  }


  const listbasepathnodes = async (x) => {
  var url = serverurl + "/api/ipfsusage/listbasepaths";
   var cred = {
        userid: userid,
        path: "/"+x ,
   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
//         setNodemessage(JSON.stringify(res));
         if(res.length >=0) {
         setMylistnodes(res);
         }

        },
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  }


  const getconfig = async () => {
  var url = serverurl + "/api/ipfsnode/getipfsconfig";
   if(userid === '') {
         setError("Userid not set");
         setShowErrorAlert(true);
     return;
  }

   var cred = {
        userid: userid,
        nodetype: nodetype
   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         localStorage.setItem("ipfsconfig", JSON.stringify(res) );
        },
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  }



 const handleSubmit = (event) => {
    event.preventDefault()
  };

  const captureFile = (event) => {
    if(statvalue > usagelimit) {
      setMessage('Reached usage limit: ' + usagelimit/1000 + 'KB');
      setShowMessageAlert(true); 
      return;
     }

    event.stopPropagation()
    event.preventDefault()

    saveToIpfsWithFilename(event.target.files)

  };

  const prepareDisplayRemoteDirectory = async (dir) => {

    var tmplocalsegment= dir.split('/');
    var cleanedlocalsegment = [] as any;
   
    for(var j =0; j< tmplocalsegment.length; j++) {
       if(tmplocalsegment[j] !== '')
       cleanedlocalsegment.push(tmplocalsegment[j]);
    }
 
    var segmentstouse = [] as any;
    console.log(JSON.stringify(cleanedlocalsegment));

    var newarray = cleanedlocalsegment.map((x)=> x);
    for(var i = 0; i< newarray.length; i++) {
 
       var lastdir =  newarray[newarray.length-i-1];
       var obj = {
         lastpath: lastdir,
         fullpath: '/'+cleanedlocalsegment.join('/') 
       };

      segmentstouse.push(obj); 
      cleanedlocalsegment.pop();
    }
    
    console.log(JSON.stringify(segmentstouse));
    segmentstouse.reverse(); 
    setMyremotesegments(segmentstouse);
    console.log(JSON.stringify(segmentstouse));
 
  };

  const prepareDisplayDirectory = async (dir) => {

    var tmplocalsegment= dir.split('/');
    var cleanedlocalsegment = [] as any;
   
    for(var j =0; j< tmplocalsegment.length; j++) {
       if(tmplocalsegment[j] !== '')
       cleanedlocalsegment.push(tmplocalsegment[j]);
    }
 
    var segmentstouse = [] as any;
    console.log(JSON.stringify(cleanedlocalsegment));

    var newarray = cleanedlocalsegment.map((x)=> x);
    for(var i = 0; i< newarray.length; i++) {
 
       var lastdir =  newarray[newarray.length-i-1];
       var obj = {
         lastpath: lastdir,
         fullpath: '/'+cleanedlocalsegment.join('/') 
       };

      segmentstouse.push(obj); 
      cleanedlocalsegment.pop();
    }
    
    console.log(JSON.stringify(segmentstouse));
    segmentstouse.reverse(); 
    setMysegments(segmentstouse);
    console.log(JSON.stringify(segmentstouse));
 
  };


  const listNewDirectory = async (newdir) => {
        setRemoteactive(false);
    preSaveDirectory(newdir); 
    prepareDisplayDirectory(newdir);
    listFiles(newdir);
  };

  const listlocalFiles = async (newdir) => {
        setRemoteactive(false);
    listFiles(newdir);
  }
  const listNewRemoteDirectory = async (newdir) => {
        setRemoteactive(true);
    preSaveRemoteDirectory(newdir); 
    prepareDisplayRemoteDirectory(newdir);
    listRemoteFiles(newdir);
  };

   const preSaveRemoteDirectory = async (dir) => {

    var tmplocalsegment= dir.split('/');
    var cleanedlocalsegment = [] as any;

    for(var j =0; j< tmplocalsegment.length; j++) {
       if(tmplocalsegment[j] !== '')
       cleanedlocalsegment.push(tmplocalsegment[j]);
    }

    var newdir = '/'+cleanedlocalsegment.join('/');
    setRemoteDirectory(newdir);
  };


  const preSaveDirectory = async (dir) => {

    var tmplocalsegment= dir.split('/');
    var cleanedlocalsegment = [] as any;

    for(var j =0; j< tmplocalsegment.length; j++) {
       if(tmplocalsegment[j] !== '')
       cleanedlocalsegment.push(tmplocalsegment[j]);
    }
   
    var newdir = '/'+cleanedlocalsegment.join('/'); 
    setDirectory(newdir); 
  };

  const pinFiles = async (dir) => {
    var options = {};
/*
    var tmpss = localStorage.getItem("ipfsconfig");
    if(tmpss != null) {
    ipfsconfig = JSON.parse(tmpss);
    console.log(ipfsconfig);
    }
*/

   var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }


   var the_arr = dir.split('/');
    var lastdir = the_arr.pop();
    if(lastdir === '')
    lastdir = the_arr.pop();
   var newdir =  the_arr.join('/') ;

   console.log("newdir =" + newdir);
   console.log("lastdir =" + lastdir);

   if(newdir === '') {
     newdir = '/';
   }

   var source = ipfs.files.ls(newdir , options)
    try {
      for await (const file of source) {
        console.log(file)

        if(file.type === 1 && file.name === lastdir) {

          var pinoptions = {
		recursive: true
          };
          var pinoutput = await ipfs.pin.add(file.cid.toString(), pinoptions);
          console.log("pinning status =" + JSON.stringify(pinoutput));
        }
      }
      setMessage('Pinned '+ dir);
      setShowMessageAlert(true); 
    } catch (err) {
      setError(err);
      setShowErrorAlert(true);

      console.error(err)
    }

  };

  const checkandcreatedir = async (dir) => {

    var options = {};

     var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }



    var source = ipfs.files.ls(dir, options)
    try {
      for await (const file of source) {
        console.log("dir="+file)
        //mylist1.push( {key:('hh'+ p++), value:file}); 
       }
     } catch (err) {
      setError(err);
      console.error(err)

      var options1 = {parents: true};
        source = await ipfs.files.mkdir(dir , options1)
      console.log(source);
    }


   source = ipfs.files.ls("/", options)
   var found = false;
    try {
      for await (const file of source) {
        console.log("dir1="+JSON.stringify(file))
        if(("/"+file.name) === dir) {
          found = true;
           var x = {
          hash: file.cid.toString(),
          name: file.name,
          cid: file.cid.toString(),
          path: dir,
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
         };

          checkbasedirentry(x);
        }
        //mylist1.push( {key:('hh'+ p++), value:file});
       }
     } catch (err) {
      setError(err);
      console.error(err)
     }

    if(found) {
    }



  };




/*
  const listdagFiles = async (dir) => {
    var options = {};


   var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }



    var dir1 = new CID(dir);
    console.log("dir="+ dir);
    console.log("dir1="+ dir1);
 var source = ipfs.ls(dir1, options)
    var testarray = [] as any;
    try {
      for await (const file of source) {
        console.log(file)
        //mylist1.push( {key:('hh'+ p++), value:file}); 
        console.log("dummy="+localgateway);
        var publicurl = 'https://ipfs.io/ipfs/'+file.cid.toString()
        var privateurl = ipfsconfig.localgateway + '/ipfs/'+file.cid.toString()

        var obj = {
         name: file.name,
         type: (file.type==='dir')? 1: 0,
         cid: file.cid.toString(),
         fullpath: null,
         publicurl: publicurl,
         privateurl: privateurl,
        };
        testarray.push(obj); 
      }
            setMylist(testarray);
    } catch (err) {
      setError(err);
      setShowErrorAlert(true);

      console.error(err)
    }

  };
*/

  const listFiles = async (dir) => {
    var options = {};


   var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }



 var source = ipfs.files.ls(dir, options)
    var testarray = [] as any;
    try {
      for await (const file of source) {
        console.log(file)
        //mylist1.push( {key:('hh'+ p++), value:file}); 
        console.log("dummy="+localgateway);
        var publicurl = 'https://ipfs.io/ipfs/'+file.cid.toString()
        var privateurl = ipfsconfig.localgateway + '/ipfs/'+file.cid.toString()

        var obj = {
         name: file.name,
         type: file.type,
         cid: file.cid.toString(),
         fullpath: dir+"/"+ file.name, 
         publicurl: publicurl,
         privateurl: privateurl,
        };
        testarray.push(obj); 
      }
            setMylist(testarray);
    } catch (err) {
      setError(err);
      setShowErrorAlert(true);

      console.error(err)
    }

  };


  const listRemoteFiles = async (dir) => {
    var options = {};


   var tmpipfs = localStorage.getItem("ipfsconfig");
   var ripfsconfig;

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    //ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }
    
    var ripfs;
    var remotenode1 = localStorage.getItem("remotenodeselected");
    if(remotenode1 != null) {
    ripfsconfig = JSON.parse(remotenode1);
    ripfs = ipfsClient(ripfsconfig.xconfig.Addresses.API) ;
    }


 var source = ripfs.files.ls(dir, options)
    var testarray = [] as any;
    try {
      for await (const file of source) {
        console.log(file)
        //mylist1.push( {key:('hh'+ p++), value:file}); 
        console.log("dummy="+localgateway);
        var publicurl = 'https://ipfs.io/ipfs/'+file.cid.toString()
        var privateurl = ripfsconfig.localgateway + '/ipfs/'+file.cid.toString()

        var obj = {
         name: file.name,
         type: file.type,
         cid: file.cid.toString(),
         fullpath: dir+"/"+ file.name, 
         publicurl: publicurl,
         privateurl: privateurl,
        };
        testarray.push(obj); 
      }
            setMylist(testarray);
    } catch (err) {
      setError(err);
      setShowErrorAlert(true);

      console.error(err)
    }

  };

  const liststat = async (dir) => {
    var options = {};
    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }

    try {
    var source = await ipfs.files.stat(dir , options)
     setStatvalue(source.cumulativeSize);

        console.log(source);
     } catch(err) {

        console.log(err);
     }

  };

  const listremotestat = async (dir) => {
    var options = {};
    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    //ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }
   
    if(!remoteactive) {
        console.log("remote not active");
      return;
    }

    var remotenode1 = localStorage.getItem("remotenodeselected");
    var ripfs;
      if(remotenode1 != null) {
     var ripfsconfig = JSON.parse(remotenode1);
      ripfs = ipfsClient(ripfsconfig.xconfig.Addresses.API) ;
     }


    try {
    var source = await ripfs.files.stat(dir , options)
     setStatvalue(source.cumulativeSize);

        console.log(source);
     } catch(err) {

        console.log(err);
     }

  };
 


  useEffect(() => {


/*
    if(mylist1.length > 0) {
      for( var x in mylist1) {
       console.log(x);
      }
    };
*/

  }, [directory]);

/*
  const mkdirfunc = async () => {
    var options = {parents: true};
    var source = await ipfs.files.mkdir('/user1/contents', options)
        console.log(source)
  };

*/
  const newmkdirfunc = async () => {
    var options = {parents: true};
     var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }


    if(dirtomake.length < 1) return; 
    var source = await ipfs.files.mkdir(directory+"/"+dirtomake, options)
        console.log("newmkdir= "+source)
    listFiles(directory);
  };

  const deletefile = async (cid) => {
    var options = {};
     var tmpipfs = localStorage.getItem("ipfsconfig");

    if(remoteactive === true) {
      var remotenode1 = localStorage.getItem("remotenodeselected");
      if(remotenode1 != null) {
      var ripfsconfig = JSON.parse(remotenode1);
      ipfs = ipfsClient(ripfsconfig.xconfig.Addresses.API) ;
      }
    } else {

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
      }
    }


    var source = await ipfs.files.rm(cid, options)
        console.log(source)
    if(remoteactive === true) {
    listRemoteFiles(directory);
    } else {
    listFiles(directory);
    }
  };



const saveToIpfsWithFilename = async (files) => {
    const file = [...files][0]
    const options = {
    create: true
    }

    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }


      await Storage.set({ key: 'user', value: 'user1' });
    var source = await ipfs.files.write(directory +'/'+file.name, file, options)
        console.log(source)
        source = ipfs.files.ls(directory +'/'+file.name, options);
         var file1 = await source.next();
	  console.log( file1.value.cid.toString() )
        
        setFilename(directory +'/'+ file.name);
        setFilehash(file1.value.cid.toString());
        var x = {
	  hash: file1.value.cid.toString(),
	  name: file.name,
	  cid: file1.value.cid.toString(),
	  path: directory,
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
        };
        saveinserver(x);
        listFiles(directory);
  };

  const createbasedirentry = async (x) => {

    var tmpipfs = localStorage.getItem("ipfsconfig");
    var ipfsconfig;
    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }

   var url = serverurl + "/api/ipfsusage/createbasepath";

   var cred = {
        userid: ipfsconfig.userid,
        name: x.name,
        path: x.path,
        hash: x.hash, 
        cid: x.cid, 
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
   };

  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
        },
        (err) => {
      setError(err);
      setShowErrorAlert(true);
          console.log(err)
        }
      )

  };

/*
      await Storage.set({ key: 'user', value: 'user1' });
    var source = await ipfs.files.write(directory +'/'+file.name, file, options)
        console.log(source)
        source = ipfs.files.ls(directory +'/'+file.name, options);
         var file1 = await source.next();
	  console.log( file1.value.cid.toString() )
        
        setFilename(directory +'/'+ file.name);
        setFilehash(file1.value.cid.toString());
        var x = {
	  hash: file1.value.cid.toString(),
	  name: file.name,
	  cid: file1.value.cid.toString(),
	  path: directory,
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
        };
        saveinserver(x);
        listFiles(directory);
  };
*/
  const checkbasedirentry = async (x) => {

    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs === null) {
      getconfig();
    }
    var ipfsconfig;
    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }else {

    console.log("config not vailable="+ipfsconfig);
    return;
    }

   var url = serverurl + "/api/ipfsusage/checkbasepaths";

   var cred = {
        userid: ipfsconfig.userid,
        name: x.name,
        path: x.path,
        hash: x.hash, 
        cid: x.cid, 
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
   };

  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         if(res.length === 0) {
         createbasedirentry( cred);
         }
        },
        (err) => {
      setError(err);
      setShowErrorAlert(true);
          console.log(err)
        }
      )

  };

  const saveinserver = async ( x ) => {

    var tmpipfs = localStorage.getItem("ipfsconfig");
    var ipfsconfig;
    if(tmpipfs != null) {
    ipfsconfig = JSON.parse(tmpipfs);
    ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);
    }

   var url = serverurl + "/api/ipfsusage/savefile";

   var cred = {
        userid: userid,
        name: x.name,
        path: x.path,
        hash: x.hash, 
        cid: x.cid, 
        nodeid:ipfsconfig.nodeid,
        nodename:ipfsconfig.nodename,
        nodegroup:ipfsconfig.nodegroup,
   };

  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" + localStorage.getItem("token"),
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
        },
        (err) => {
      setError(err);
      setShowErrorAlert(true);
          console.log(err)
        }
      )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle> File manager </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">File manager </IonTitle>
          </IonToolbar>
        </IonHeader>

    <IonList>
            <IonCard >
     <IonCardHeader>
    IPFS storage system 
     </IonCardHeader>
            <IonItem >
      <IonGrid>
  <IonRow>
    <IonCol>
              <IonLabel color="primary">Nodetype  </IonLabel>
    </IonCol>
    <IonCol>
              <IonLabel color="primary"> {nodetype} </IonLabel>
    </IonCol>
  </IonRow>
  <IonRow>
    <IonCol>
              <IonLabel color="primary">Userid  </IonLabel>
    </IonCol>
    <IonCol>
              <IonLabel color="primary"> {userid} </IonLabel>
    </IonCol>
  </IonRow>
  <IonRow>
    <IonCol>
              <IonLabel color="primary">Remotes  </IonLabel>
    </IonCol>

    <IonCol>
     <IonButton size="small" shape="round" fill="outline"   onClick={()=>listbasepathnodes(userid)}  >
       List
    </IonButton>
    </IonCol>
  </IonRow>



      </IonGrid>
            </IonItem >

   <IonCard >
     <IonCardHeader>
    Remote nodes 
     </IonCardHeader>

       {
           mylistnodes.map((a, index) =>      {
         return (
            <IonItem key={'somerandomghxx'+index}>
      
           <IonLabel class="ion-text-wrap">
      <IonGrid>
  <IonRow>
    <IonCol>
      <IonText color="danger">
        <h3> Group:  {a['nodegroup']} </h3>
        <h4> Id: {a['nodeid']} </h4>
      </IonText>
    </IonCol>
    <IonCol>
    </IonCol>
    <IonCol>
     <IonButton size="small" shape="round" fill="outline"   onClick={()=>selectnode(a)}  >
       {a['nodename']}
    </IonButton>
    </IonCol>
    <IonCol>
    </IonCol>
  </IonRow>
      </IonGrid>

    </IonLabel>
            </IonItem>

      ) 

          })
       }  

   </IonCard >
            <IonItem >
      <IonGrid>

  <IonRow>
    <IonCol>
    Current directory
    </IonCol>
    <IonCol>





           {
           mysegments.map((a, index) =>      {
         return (
            <IonText key={'somggsgserandohmxxx'+index}   onClick={()=>listNewDirectory(a['fullpath'])} >/{a['lastpath']}</IonText>
           )
           })
          }
    </IonCol>
  </IonRow>

  <IonRow>
    <IonCol>
    Remote current directory
    </IonCol>
    <IonCol>





           {
           myremotesegments.map((a, index) =>      {
         return (
            <IonText key={'somggsgserandohmxxx'+index}   onClick={()=>listNewRemoteDirectory(a['fullpath'])} >/{a['lastpath']}</IonText>
           )
           })
          }
    </IonCol>
  </IonRow>
      </IonGrid>
            </IonItem>
            </IonCard >

   <IonCard >
     <IonCardHeader>
    File processing
     </IonCardHeader>

            <IonItem >
 <IonBadge slot="start">1</IonBadge>
      <IonGrid>
  <IonRow>
    <IonCol>
              <IonInput name="listname" type="text" placeholder="Create directory " value={dirtomake} spellCheck={false} autocapitalize="off" onIonChange={e => setDirtomake(e.detail.value!)} >
              </IonInput>
    </IonCol>
    <IonCol>
            <IonButton shape="round" fill="outline" onClick={newmkdirfunc} > mkdir </IonButton>
    </IonCol>
  </IonRow>
      </IonGrid>
            </IonItem>
            
    <IonItem >
 <IonBadge slot="start">2</IonBadge>
      <IonGrid>
  <IonRow>
    <IonCol>
          <IonLabel color="primary"   >  Choose file to upload </IonLabel>
    </IonCol>
    <IonCol>
    <div>
        <form id='captureMedia' onSubmit={handleSubmit}>
          <input type='file' onChange={captureFile} /><br/>
        </form>
        </div>
  <div>
          <a target='_blank' rel="noopener noreferrer"
            href={'https://ipfs.io/ipfs/' + filehash}>
            {filename}
          </a>
        </div>
    </IonCol>
  </IonRow>
      </IonGrid>
            </IonItem >
   </IonCard >

   <IonCard >
     <IonCardHeader>
    File queries
     </IonCardHeader>


            <IonItem >
      <IonGrid>
  <IonRow>
    <IonCol>
            <IonButton shape="round" fill="outline" onClick={()=>listlocalFiles(directory)} size="small" > List files </IonButton>
    </IonCol>
    <IonCol>
            <IonButton shape="round"  disabled={ (remoteactive === true) }  fill="outline" onClick={()=>pinFiles(directory)} size="small" > Pin directory </IonButton>
    </IonCol>
  </IonRow>
      </IonGrid>
            </IonItem >
            <IonItem >
      <IonGrid>
  <IonRow>
    <IonCol>
            <IonButton shape="round" fill="outline" onClick={()=>liststat(directory)} size="small" > Usage </IonButton>
            <IonButton shape="round" fill="outline" onClick={()=>listremotestat(remotedirectory)} size="small" > Remote usage </IonButton>
    </IonCol>
    <IonCol>
          <IonLabel color="primary"   > {statvalue}  bytes   </IonLabel>
    </IonCol>
  </IonRow>
      </IonGrid>
            </IonItem >
   </IonCard >
   <IonCard >
     <IonCardHeader>
    File listing
     </IonCardHeader>

       {
           mylist.map((a, index) =>      {
         return (
            <IonItem key={'somerandomghxx'+index}>
      { a['type'] ? (
           <IonLabel class="ion-text-wrap">
      <IonGrid>
  <IonRow>
    <IonCol>
      <IonText color="danger">
        <h3> /{a['name']} </h3>
      </IonText>
    </IonCol>
    <IonCol>
    </IonCol>
    <IonCol>
     { (remoteactive === false) ? ( <IonButton size="small" shape="round" fill="outline"  onClick={()=>listNewDirectory(a['fullpath'])} >
       Directory
    </IonButton>
     ) : (
     <IonButton size="small" shape="round" fill="outline"  onClick={()=>listNewRemoteDirectory(a['fullpath'])} >
       RemDirectory
    </IonButton>
       )
    }
    </IonCol>
    <IonCol>
    </IonCol>
  </IonRow>
      </IonGrid>

    </IonLabel>

      ) : (
           <IonLabel class="ion-text-wrap">
      <IonGrid>
  <IonRow>
    <IonCol>
        <h3> {a['name']} </h3>
    </IonCol>
  </IonRow>
  <IonRow>
    <IonCol>
           <a target="_blank" rel="noopener noreferrer" href={a['publicurl']} >Public </a>
    </IonCol>
    <IonCol>
           <a target="_blank" rel="noopener noreferrer" href={a['privateurl']} >Private </a>
    </IonCol>
    <IonCol>
           <a  target="_blank"  rel="noopener noreferrer" href={a['privateurl']} download> Download </a>
    </IonCol>
    <IonCol>
     <IonButton shape="round" fill="outline" onClick={()=>deletefile(a['fullpath'])} >
      <IonIcon size="small" slot="icon-only" icon={trashicon} />
    </IonButton>
    </IonCol>
  </IonRow>

      </IonGrid>


    </IonLabel>
      ) }



            </IonItem>
          ) 
          })
       }  

   </IonCard >



    </IonList>

    <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setShowErrorAlert(false)}
          header={'Alert'}
          subHeader={'Error'}
          message={error}
          buttons={['OK']}
        />

  <IonAlert
          isOpen={showLoginAlert}
          onDidDismiss={() => setShowLoginAlert(false)}
          header={'Instruction'}
          subHeader={'Login '}
          message={loginmessage}
          buttons={['OK']}
        />

    <IonAlert
          isOpen={showMessageAlert}
          onDidDismiss={() => setShowMessageAlert(false)}
          header={'Message'}
          message={message}
          buttons={['OK']}
        />


   

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
