
//import { Plugins } from '@capacitor/core';
import React, { useState }  from 'react';
import {  IonGrid, IonCard, IonText, IonCardHeader,  useIonViewWillEnter, IonListHeader, IonRadioGroup,IonRadio, IonRow, IonCol, IonAlert, IonButton, IonList,IonInput, IonLabel,IonItem,  IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ipfsClient from 'ipfs-http-client';


import './Tabjoin.css';

import configdata from './config.json';


//const { Storage } = Plugins;
const Tabjoin: React.FC = () =>  {
  const [email, setEmail] = useState('');
  const [nodeidtoadd, setNodeidtoadd] = useState('');
  const [nodegrouptoadd, setNodegrouptoadd] = useState('');
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [nodetype, setNodetype] = useState('privatesharednode');
  const [password, setPassword] = useState('');
  const [loginmessage, setLoginmessage] = useState('Place for login message');
  const [loginalert, setLoginalert] = useState('');
  const [message, setMessage] = useState('');
  const [messageAlert, showMessageAlert] = useState(false);
  const [workingnode, setWorkingnode] = useState('');
  const [mylistnodes, setMylistnodes] = React.useState([]);

  const [nodemessage, setNodemessage] = useState('Place for node message');
  const [statvalue, setStatvalue] = useState(0);
  const [listvalue, setListvalue] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);



  //const [filehash, setFilehash] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState('');

   // const serverurl = "https://157.245.63.46:443/";
//    const serverurl = "http://157.245.63.46:8080";
const serverurl = configdata.sailsurl;

  var ipfs = ipfsClient(configdata.apilink) ;



/*
ipfsClient({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
  headers: {
    authorization: 'Bearer ' + TOKEN
  }
})

*/



 // const [orbitdb, setOrbit] = useState();

  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
    var tmptoken = localStorage.getItem("token");
    var tuserinfo = localStorage.getItem('userinfo') as any;
    var userinfo = null as any;

    console.log("userinfo="+ tuserinfo);
    try {
      userinfo = JSON.parse(tuserinfo); 
    } catch(err)   {
     return;
    };

    if(userinfo != null )
    {
        console.log(tuserinfo);
	setUsername(userinfo.username);
	setUserid(userinfo.userid);
	setEmail(userinfo.email);
    }


    if(tmptoken == null)
    {
      setLoginalert("Login to proceed");
      setShowLoginAlert(true);
      return;
    }

    logintest();

    if(userid !== '' ) {
      getconfig();
    }

    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs == null)
     {
      setLoginalert("Config not created");
      setShowLoginAlert(true);
      return;
     } else {
       var ipfsconfig = JSON.parse(tmpipfs);
       ipfs = ipfsClient(ipfsconfig.config.Addresses.API) ;
    console.log(ipfsconfig);

     }

   });


  const mylogin = async () => {
  var url = serverurl + "/api/auth/login";
  var cred = {
	email: email,
	username: username,
	role: 'user',
        password: password
   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",              
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         localStorage.setItem('token', res.token);
         localStorage.setItem('userinfo', JSON.stringify(res.user));
         setLoginmessage(JSON.stringify(res));
	 setUsername(res.user.username);
	 setUserid(res.user.userid);
	 setEmail(res.user.email);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const logintest = async () => {
  var url = serverurl + "/api/auth/protected";

  fetch(url,
   {
      method: 'GET',
      headers: {
//        "Content-Type": "application/json",
        "Authorization": "" + localStorage.getItem("token"),
      }
    })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         setLoginmessage(JSON.stringify(res));
         return 0;
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
         return -1;
        }
      )
  } 
  const myregister = async () => {
  var url = serverurl + "/api/auth/register";
   var cred = {
        email: email,
	username: username,
	role: 'user',
        password: password
   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         localStorage.setItem('token', res.token);
         setLoginmessage(JSON.stringify(res));
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const stopnode = async () => {
  var url = serverurl + "/api/ipfsnode/stopnode";
   var cred = {
	userid: userid,
   };
  fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": "" + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cred)
     })
      .then(res => res.json())
      .then(
        (res) => {
         console.log(res);
         setNodemessage(JSON.stringify(res));
           
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const startnode = async () => {
  var url = serverurl + "/api/ipfsnode/startnode";
   var cred = {
	userid: userid
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
         setNodemessage(JSON.stringify(res));
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const listpublicnodes = async () => {
  var url = serverurl + "/api/nodeoperation/listpublicnodes";
   var cred = {
        userid: userid,
        nodetype: 'publicnode',
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
         setMylistnodes(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const listprivatenodes = async () => {
  var url = serverurl + "/api/nodeoperation/listprivatenodes";
   var cred = {
	userid: userid
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
         setMylistnodes(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

  const listclusternodes = async () => {
  var url = serverurl + "/api/nodeoperation/listclusternodes";
   var cred = {
	userid: userid
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
         setMylistnodes(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 
/*
  const gettokenbalance = async () => {
  var url = serverurl + "/api/tokenuser/gettokenbalance";
   var cred = {
	userid: userid
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
//         setMylistnodes(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 
*/
/*
  const saveinserver = async ( x ) => {

   var url = serverurl + "/api/ipfsusage/savefile";

   var cred = {
        userid: 'user1',
        name: x.name,
        path: x.path,
        hash: x.hash, 
        cid: x.cid, 
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

*/
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

/*
 const handleSubmit = (event) => {
    event.preventDefault()
  };

  const captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()

      saveToIpfsWithFilename(event.target.files)

  };
*/

/*
const saveToIpfsWithFilename = async (files) => {
    const file = [...files][0]
    const options = {
    create: true
    }

      await Storage.set({ key: 'user', value: 'user1' });
    var source = await ipfs.files.write('/user1/contents/'+file.name, file, options)
        console.log(source)
        source = ipfs.files.ls('/user1/contents/'+file.name, options);
         var file1 = await source.next();
	  console.log( file1.value.cid.toString() )
        
        setFilehash('/user1/contents/'+ file.name);
        var x = {
	  hash: file1.value.cid.toString(),
	  name: file.name,
	  cid: file1.value.cid.toString(),
	  path: '/user1/contents/'
        };
        saveinserver(x);
  };

*/

  const listfiles = async () => {
    var options = {};
 var source = ipfs.files.ls('/user1/contents/', options)
     var arraylength = 0;
    try {
      for await (const file of source) {
        console.log(file)
        arraylength ++;
      }
    } catch (err) {
         setError(err);
         setShowErrorAlert(true);
      console.error(err)
    }
        setListvalue(arraylength);

  };

  const selectnode = async (node) => {
        setWorkingnode(node);
        console.log(workingnode);
        setMessage("Selected "+ workingnode);
        showMessageAlert(true);

  };

  const joinnodecluster = async () => {

     if(nodeidtoadd === '')
     {
        setMessage("Enter nodeid to add ");
        showMessageAlert(true);
        return;
     }

     if(nodegrouptoadd === '')
     {
        setMessage("Enter nodegroup to add ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/nodeoperation/joinnodecluster";
   var cred = { 
        userid: userid,
        nodeid: nodeidtoadd,
        nodetype: 'clusternode',
        nodegroup: nodegrouptoadd,
        
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
//         setMylistnodes(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const joinnodepublic = async () => {

     if(nodeidtoadd === '')
     {
        setMessage("Enter nodeid to add ");
        showMessageAlert(true);
        return;
     }

     if(nodegrouptoadd === '')
     {
        setMessage("Enter nodegroup to add ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/nodeoperation/joinnodepublic";
   var cred = { 
        userid: userid,
        nodeid: nodeidtoadd,
        nodetype: 'publicnode',
        nodegroup: nodegrouptoadd,
        
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
//         setMylistnodes(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }
  const deletenode = async () => {

     if(workingnode === '')
     {
        setMessage("Select node to assign");
        showMessageAlert(true);
        return;
     }

     if(userid === '')
     {
        setMessage("Userid not selected    ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/nodeoperation/deletenodeid";
   var cred = { 
        userid: userid,
        nodeid: workingnode,
        
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
//         setMylistnodes(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const assignnodetouser = async () => {

     if(workingnode === '')
     {
        setMessage("Select node to assign");
        showMessageAlert(true);
        return;
     }

     if(userid === '')
     {
        setMessage("Userid not selected    ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/assignnodetouser";
   var cred = { 
        userid: userid,
        nodeid: workingnode,
        
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
//         setMylistnodes(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const joinnodeprivate = async () => {

     if(nodeidtoadd === '')
     {
        setMessage("Enter nodeid to add ");
        showMessageAlert(true);
        return;
     }

     if(nodegrouptoadd === '')
     {
        setMessage("Enter nodegroup to add ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/nodeoperation/joinnodeprivate";
   var cred = { 
        userid: userid,
        nodeid: nodeidtoadd,
        nodetype: 'privatenode',
        nodegroup: nodegrouptoadd,
        
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
//         setMylistnodes(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const liststat = async () => {
    var options = {};
    var source = await ipfs.files.stat('/user1/contents/', options)
        console.log(source)
        setStatvalue(source.cumulativeSize);

  };

/*
 const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
 };
*/
  


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Node join panel </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"> Login, connect  </IonTitle>
          </IonToolbar>
        </IonHeader>

    <IonList>
          <IonItem>
              <IonLabel position="stacked" color="primary">Username</IonLabel>
              <IonInput name="username" type="text" value={username} spellCheck={false} autocapitalize="off" onIonChange={e => setUsername(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>


        <IonItem>
              <IonLabel position="stacked" color="primary">Email</IonLabel>
              <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>
       <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>
   <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={mylogin}> Login </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" onClick={myregister}> Register </IonButton>
            </IonCol>
          </IonRow>


            <IonItem>
              <IonInput name="nodeidtoadd" placeholder="Node id to add" type="text" value={nodeidtoadd} spellCheck={false} autocapitalize="off" onIonChange={e => setNodeidtoadd(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput name="nodegrouptoadd" placeholder="nodegrouptoadd to add" type="text" value={nodegrouptoadd} spellCheck={false} autocapitalize="off" onIonChange={e => setNodegrouptoadd(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
            <IonButton size="small" shape="round" fill="outline" onClick={joinnodecluster}> Join node cluster </IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={joinnodepublic}> Join node public </IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={joinnodeprivate}> Join node private </IonButton>
            </IonItem>

            <IonItem>
            <IonButton size="small" shape="round" fill="outline" onClick={listprivatenodes}> List private nodes </IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={listpublicnodes}> List public nodes </IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={listclusternodes}> List public cluster nodes </IonButton>
            </IonItem>
            <IonItem>
            <IonButton size="small" shape="round" fill="outline" onClick={assignnodetouser}> Assign node to user </IonButton>
            <IonButton size="small" shape="round" fill="outline" onClick={deletenode}> Delete node  </IonButton>
            </IonItem>
            <IonItem>
               <IonLabel>
               {loginmessage}
               </IonLabel>
            </IonItem>
            <IonItem>
            <IonButton onClick={logintest}> Test Login </IonButton>
            </IonItem>
            <IonItem>
            <IonButton onClick={startnode}> startnode </IonButton>
            <IonButton onClick={stopnode}> stopnode </IonButton>
            <IonButton onClick={getconfig}> getconfig </IonButton>
            </IonItem>
            <IonItem>
            </IonItem>
            <IonItem>
            <IonButton onClick={stopnode}> A-assigntype </IonButton>
            <IonButton onClick={stopnode}> A-migrate </IonButton>
            <IonButton onClick={stopnode}> A-validate-aftermigrate </IonButton>
            <IonButton onClick={getconfig}> A-disable </IonButton>
            <IonButton onClick={getconfig}> A-stop </IonButton>
            </IonItem>
            <IonItem>
            <IonButton onClick={getconfig}> A-createp2p </IonButton>
            <IonButton onClick={getconfig}> A-checkp2p </IonButton>
            <IonButton onClick={getconfig}> A-listnodes </IonButton>
            <IonButton onClick={getconfig}> A-checkpins </IonButton>
            <IonButton onClick={getconfig}> A-assignfeatures </IonButton>
            </IonItem>

            <IonItem>
               <IonLabel>
               {nodemessage}
               </IonLabel>
            </IonItem>

            <IonItem >
            <IonButton onClick={listfiles}> Number of files </IonButton>
            <IonLabel slot="end" >  {listvalue} </IonLabel>
            </IonItem>
            <IonItem >
            <IonButton onClick={liststat}> Size usage (bytes) </IonButton>
            <IonLabel slot="end" >  {statvalue} </IonLabel>
            </IonItem>

           <IonRadioGroup value={nodetype}   onIonChange={e => setNodetype(e.detail.value!)} >
        <IonListHeader>
          <IonLabel>Usage type</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonLabel>Private node </IonLabel>
          <IonRadio slot="start" value="privatenode" />
        </IonItem>

        <IonItem>
          <IonLabel>Private shared node </IonLabel>
          <IonRadio slot="start" value="privatesharednode" />
        </IonItem>

        <IonItem>
          <IonLabel>Public shared node</IonLabel>
          <IonRadio slot="start" value="publicsharednode" />
        </IonItem>

        <IonItem>
          <IonLabel>Cluster node</IonLabel>
          <IonRadio slot="start" value="clusternode" />
        </IonItem>
       </IonRadioGroup>

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
          message={loginalert}
          buttons={['OK']}
        />
   

   <IonAlert
          isOpen={messageAlert}
          onDidDismiss={() => showMessageAlert(false)}
          header={''}
          subHeader={'Message '}
          message={message}
          buttons={['OK']}
        />


   <IonCard >
     <IonCardHeader>
    Users 
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
        <h3> {a['nodegroup']} </h3>
        <h4> {a['nodename']} </h4>
      </IonText>
    </IonCol>
    <IonCol>
    </IonCol>
    <IonCol>
     <IonButton size="small" shape="round" fill="outline"   onClick={()=>selectnode(a['nodeid'])}  >
       {a['nodeid']}
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

   <IonCard>
            <IonItem>
     <IonButton size="small" shape="round" fill="outline"   > Expand       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Disable       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Enable       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Delete       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Archive       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Restore       </IonButton>
     
            </IonItem>

   </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Tabjoin;
