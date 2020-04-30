
//import { Plugins } from '@capacitor/core';
import React, { useState }  from 'react';
import {  IonGrid, IonCard, IonText, IonCardHeader,  useIonViewWillEnter, IonRow, IonCol, IonAlert, IonButton, IonList,IonInput, IonLabel,IonItem,  IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
//import ipfsClient from 'ipfs-http-client';


import './Tab1.css';
import configdata from './config.json';

//const { Storage } = Plugins;
const Tab1: React.FC = () =>  {
  const [email, setEmail] = useState('');
  const [tokentoadd, setTokentoadd] = useState('');
  const [tokentoredeem, setTokentoredeem] = useState('');
  const [usagetoadd, setUsagetoadd] = useState('');
  const [newusagelimit, setNewusagelimit] = useState('');
  const [tokentosend, setTokentosend] = useState('');
//  const [touserid, setTouserid] = useState('');
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
//  const [nodetype, setNodetype] = useState('privatesharednode');
  const [password, setPassword] = useState('');
  const [loginmessage, setLoginmessage] = useState('Place for login message');
  const [loginalert, setLoginalert] = useState('');
  const [message, setMessage] = useState('');
  const [messageAlert, showMessageAlert] = useState(false);
  const [workinguser, setWorkinguser] = useState('');
  const [mylistusers, setMylistusers] = React.useState([]);

  const [nodemessage, setNodemessage] = useState('Place for node message');
//  const [statvalue, setStatvalue] = useState(0);
//  const [listvalue, setListvalue] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);



  //const [filehash, setFilehash] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState('');

   // const serverurl = "https://157.245.63.46:443/";
//    const serverurl = "http://157.245.63.46:8080";
 const serverurl = configdata.sailsurl; //"http://54.169.57.146:1337";

//  const ipfs = ipfsClient('/ip4/172.31.5.90/tcp/5001')


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

    if(userid !== ''){
       getconfig();
    }

    var tmpipfs = localStorage.getItem("ipfsconfig");

    if(tmpipfs == null)
     {
      setLoginalert("Config not created");
      setShowLoginAlert(true);
      return;
     }

     listusers();
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

  const listusers = async () => {
  var url = serverurl + "/api/ipfsadmin/listusers";
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
         setMylistusers(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 

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
//         setMylistusers(res);
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  } 
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
	nodetype: "privatesharednode" // nodetype
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
/*
  const details = async () => {
  
  var url = serverurl + "/api/ipfsadmin/getdetails";
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
         var pp = JSON.stringify(res);
         localStorage.setItem('details', pp);
           
        },      
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }
      )
  };

*/
/*
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
*/
  const selectuser = async (user) => {
        setWorkinguser(user);
        console.log(workinguser);
        setMessage("Selected "+ workinguser);
        showMessageAlert(true);

  };

  const addtoken = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }

     if(tokentoadd === '')
     {
        setMessage("Enter token to add ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/tokenuser/tokentoadd";
   var cred = { 
        userid: userid,
        toamount: tokentoadd,
        touserid: workinguser,
        
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
//         setMylistusers(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const sendtoken = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }

     if(tokentosend === '')
     {
        setMessage("Enter token to send ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/tokenuser/sendtoken";
   var cred = { 
        userid: userid,
        touserid: workinguser,
        toamount: tokentosend,
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
//         setMylistusers(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }
  const updateearnedtoken = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/tokenuser/updateearnedtoken";
   var cred = { 
        userid: userid,
        touserid: workinguser,
        usage: usagetoadd
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
//         setMylistusers(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   


  }

  const redeemtoken = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/tokenuser/redeemtoken";
   var cred = { 
        fromuserid: workinguser,
        touserid: userid,
        toredeem: tokentoredeem
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
//         setMylistusers(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   


  }

  const createuserwallet = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/tokenuser/createuserwallet";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   


  }

  const createuserconfig = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/createuserconfig";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   


  }

  const enableuser = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/enableuser";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   
}

  const disableuser = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/disableuser";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const expandusagelimit = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/disableuser";
   var cred = { 
        userid: workinguser,
        newusagelimit: newusagelimit
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const getuserconfig = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/getuserconfig";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   

  }

  const updateuserconfig = async () => {
     if(workinguser === '')
     {
        setMessage("Select user first ");
        showMessageAlert(true);
        return;
     }


   var url = serverurl + "/api/ipfsadmin/updateuserconfig";
   var cred = { 
        userid: workinguser
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
//         setMylistusers(res);
           getconfig();
        },    
        (err) => {
         setError(err);
         setShowErrorAlert(true);
          console.log(err)
        }   
      )   


  }

/*
  const liststat = async () => {
    var options = {};
    var source = await ipfs.files.stat('/user1/contents/', options)
        console.log(source)
        setStatvalue(source.cumulativeSize);

  };
*/

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
          <IonTitle>Super admin panel </IonTitle>
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
<IonItem>
               <IonLabel>
               {loginmessage}
               </IonLabel>
            </IonItem>

   <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={mylogin}> Login </IonButton>
            </IonCol>
            <IonCol>
              <IonButton expand="block" onClick={myregister}> Register </IonButton>
            </IonCol>
          </IonRow>


   <IonCard >
     <IonCardHeader>
           <IonLabel>
    Users 
           </IonLabel>
           <IonLabel >
            <IonButton  size="small" shape="round" fill="outline" onClick={listusers}> A-List users </IonButton>
           </IonLabel>
     </IonCardHeader>

       {
           mylistusers.map((a, index) =>      {
         return (
            <IonItem key={'somerandomghxx'+index}>
      
           <IonLabel class="ion-text-wrap">
      <IonGrid>
  <IonRow>
    <IonCol>
      <IonText color="danger">
        <h3> {a['username']} </h3>
      </IonText>
    </IonCol>
    <IonCol>
    </IonCol>
    <IonCol>
     <IonButton size="small" shape="round" fill="outline"   onClick={()=>selectuser(a['userid'])}  >
       {a['userid']}
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
     <IonButton size="small" shape="round" fill="outline"   onClick={createuserconfig} > Create user config       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   onClick={updateuserconfig} > Update user config       </IonButton>
            </IonItem>
            <IonItem>
     <IonButton size="small" shape="round" fill="outline"   onClick={getuserconfig}   > Details       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   onClick={expandusagelimit}  > Expand       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   onClick={disableuser}  > Disable       </IonButton>
     <IonButton size="small" shape="round" fill="outline" onClick={enableuser}   > Enable       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Delete       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Archive       </IonButton>
     <IonButton size="small" shape="round" fill="outline"   > Restore       </IonButton>
     
     </IonItem>
     <IonItem>
       <IonButton size="small" shape="round" fill="outline" onClick={createuserwallet}> A- Creatwallet </IonButton>
       <IonButton size="small" shape="round" fill="outline" onClick={updateearnedtoken}> A-Add Earning </IonButton>
       <IonButton size="small" shape="round" fill="outline" onClick={addtoken}> A-Add token </IonButton>
       <IonButton size="small" shape="round" fill="outline" onClick={gettokenbalance}> A-gettokenbalance </IonButton>
       <IonButton size="small" shape="round" fill="outline" onClick={redeemtoken}> A-Redeem token </IonButton>
       <IonButton size="small" shape="round" fill="outline" onClick={sendtoken}> A-Send token </IonButton>
       </IonItem>

   </IonCard>

            <IonCard>

            <IonItem>
              <IonInput name="newusagelimit" placeholder="Limit to add" type="text" value={newusagelimit} spellCheck={false} autocapitalize="off" onIonChange={e => setNewusagelimit(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput name="usagetoadd" placeholder="Usage to add" type="text" value={usagetoadd} spellCheck={false} autocapitalize="off" onIonChange={e => setUsagetoadd(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput name="tokentoadd" placeholder="Token to add" type="text" value={tokentoadd} spellCheck={false} autocapitalize="off" onIonChange={e => setTokentoadd(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput name="tokentoredeem" placeholder="Token to redeem" type="text" value={tokentoredeem} spellCheck={false} autocapitalize="off" onIonChange={e => setTokentoredeem(e.detail.value!)}>
              </IonInput>
            </IonItem>
            <IonItem>
              <IonInput name="tokentosend" placeholder="Token to send" type="text" value={tokentosend} spellCheck={false} autocapitalize="off" onIonChange={e => setTokentosend(e.detail.value!)}>
              </IonInput>
            </IonItem>
            </IonCard>

            <IonCard>
            <IonItem>
            <IonButton onClick={logintest}> Test Login </IonButton>
            <IonButton onClick={startnode}> startnode </IonButton>
            <IonButton onClick={stopnode}> stopnode </IonButton>
            <IonButton onClick={getconfig}> getconfig </IonButton>
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
            </IonCard>




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



      </IonContent>
    </IonPage>
  );
};

export default Tab1;
