(this.webpackJsonpuno=this.webpackJsonpuno||[]).push([[0],{16:function(e,t,n){},17:function(e,t,n){},21:function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=21},22:function(e,t,n){"use strict";n.r(t);var c=n(2),r=n.n(c),a=n(11),o=n.n(a),i=(n(16),n(1)),s=n(5),l=n(3),u=(n(17),n(0)),d=function(e){var t=e.card,n=e.hidden,c=void 0!==n&&n,r=e.onClick,a={red:"red",yellow:"orange",blue:"aqua",green:"green",wild:"gray"};return t?Object(u.jsx)("div",{onClick:function(e){!c&&r&&r(e)},style:{backgroundColor:c?"darkgray":"wild"===t.color&&t.assignedColor?a[t.assignedColor]:a[t.color],color:"black"},children:Object(u.jsx)("span",{children:c?"<uno>":t.face})}):Object(u.jsx)(u.Fragment,{})},j=n(4),b=n.n(j);function f(e){for(var t=e.length-1;t>0;t--){var n=Math.floor(Math.random()*(t+1)),c=e[t];e[t]=e[n],e[n]=c}}var O=["blue","red","green","yellow"],p=["0","1","2","3","4","5","6","7","8","9","+2","reverse","skip"],h=["+4","change_color"],g=function(){return[].concat(Object(s.a)(p.concat(p.filter((function(e){return"0"!==e}))).map((function(e){return O.map((function(t){return{color:t,face:e}}))})).flat()),Object(s.a)(h.concat(h,h,h).map((function(e){return{color:"wild",face:e}}))))},m={numDecks:1,playerNames:["player 1","player 2","player 3","player 4"],startingHandSize:7,maxDraws:1,plusTwosStackWithFours:!0,plusTwoSkip:!1,plusFourSkip:!0,unoPenalty:5},v=function(e){return Object(i.a)(Object(i.a)({},m),e)},y=function(e,t){return(e%t+t)%t},x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=v(e),n=b.a.range(t.numDecks).map(g).flat();f(n);var c=t.playerNames.length;return Object(i.a)({deck:b.a.drop(n,c*t.startingHandSize+1),discard:[n[c*t.startingHandSize]],players:t.playerNames.map((function(e,c){return{name:e,cards:b.a.take(b.a.drop(n,c*t.startingHandSize),t.startingHandSize)}})),direction:"forward",currentPlayer:0,currentDraws:0,currentPot:[],winner:void 0,unclaimedUno:void 0},t)},k=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,c=b.a.slice(e,n,n+t),r=[].concat(Object(s.a)(b.a.take(e,n)),Object(s.a)(b.a.drop(e,n+t)));return[r,c]},w=function(e,t,n){return e.currentPot.length>0&&("+2"===n.face||"+4"===n.face)&&(n.face===t.face||e.plusTwosStackWithFours&&("wild"===n.color||"wild"===t.color&&n.color===t.assignedColor))||e.currentPot.length<=0&&(t.face===n.face||t.color===n.color||"wild"===t.color&&t.assignedColor===n.color||"wild"===n.color)},S=function(e,t,n,c){if(e.currentPlayer!==t)return e;var r=e.players[t],a=k(r.cards,1,n),o=Object(l.a)(a,2),u=o[0],d=o[1],j=b.a.first(d),f=b.a.first(e.discard);return j&&f&&w(e,f,j)?("wild"===j.color&&(j.assignedColor=null!==c&&void 0!==c?c:"green"),Object(i.a)(Object(i.a)(Object(i.a)({},e),{},{discard:[j].concat(Object(s.a)(e.discard)),players:e.players.map((function(e,n){return n===t?Object(i.a)(Object(i.a)({},e),{},{cards:u}):e})),winner:0===u.length?e.players[t]:void 0,unclaimedUno:1===u.length?t:void 0},P(e)),C(e,j,u))):e},C=function(e,t,n){switch(t.face){case"skip":return Object(i.a)({},P(e,2));case"reverse":var c="forward"===e.direction?"backward":"forward";return Object(i.a)({direction:c},P(Object(i.a)(Object(i.a)({},e),{},{direction:c}),2===e.players.length?2:1));case"+4":case"+2":var r=P(e).currentPlayer;if(e.players[r].cards.some((function(n){return function(e,t,n){return t.face===n.face||e.plusTwosStackWithFours&&("+4"===t.face&&t.assignedColor===n.color&&"+2"===n.face||"+2"===t.face&&"+4"===n.face)}(e,t,n)})))return{currentPot:[].concat(Object(s.a)(e.currentPot),["+2"===t.face?2:4])};var a=k(e.deck,b.a.sum(e.currentPot)+("+2"===t.face?2:4),0),o=Object(l.a)(a,2),u=o[0],d=o[1];return Object(i.a)({deck:u,players:e.players.map((function(t,c){return c===r?Object(i.a)(Object(i.a)({},t),{},{cards:[].concat(Object(s.a)(t.cards),Object(s.a)(d))}):c===e.currentPlayer?Object(i.a)(Object(i.a)({},t),{},{cards:n}):t})),currentPot:[]},"+2"===t.face&&e.plusTwoSkip||"+4"===t.face&&e.plusFourSkip||e.plusFourSkip&&e.currentPot.find((function(e){return 4===e}))||e.plusTwoSkip&&e.currentPot.find((function(e){return 2===e}))?P(e,2):{});default:return{}}},P=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return{currentPlayer:y(e.currentPlayer+("forward"===e.direction?1:-1)*t,e.players.length),currentDraws:0}},D=n(10),F=n.n(D),N=function(e,t){if(console.log("was tasked to send msg:",t,"to conn:",e),!Array.isArray(e))return console.log("Sending message to ".concat(null===e||void 0===e?void 0:e.peer),t),null===e||void 0===e?void 0:e.send(JSON.stringify(t));e.forEach((function(e){console.log("Sending message to ".concat(e.peer),t),e.send(JSON.stringify(t))}))},T=n(6),U=function(e){var t=e.readOnly,n=e.setGameConfig,r=Object(c.useState)(!1),a=Object(l.a)(r,2),o=a[0],s=a[1],d=Object(c.useState)(!1),f=Object(l.a)(d,2),O=f[0],p=f[1],h=Object(c.useState)({numDecks:{type:"number",default:1,description:"Number of UNO decks to use"},startingHandSize:{type:"number",default:7,description:"Number of cards in the starting hand"},maxDraws:{type:"number",default:1,description:"Amount of card draws one can make before skipping their turn. 0 for infinite"},plusTwosStackWithFours:{type:"boolean",default:!1,description:"Wether a +2 be stacked with a +4 and vice-versa"},plusTwoSkip:{type:"boolean",default:!1,description:"Wether playing a +2 will skip the victim's turn"},plusFourSkip:{type:"boolean",default:!0,description:"Wether playing a +4 will skip the victim's turn"},unoPenalty:{type:"number",default:5,description:"The amount of cards used to penalize who doesn't call UNO on time"}}),g=Object(l.a)(h,2),m=g[0],v=g[1];Object(c.useEffect)((function(){s(t||O)}),[t,O]);var y=function(e){var t=e.config,n=e.locked,c=e.value,r=e.onChange;switch(t.type){case"boolean":return Object(u.jsx)("input",{disabled:n,type:"checkbox",checked:c,onChange:r});case"number":return Object(u.jsx)("input",{disabled:n,type:"number",value:c,onChange:r});case"string":return Object(u.jsx)("input",{disabled:n,type:"text",value:c,onChange:r})}};return Object(u.jsxs)("div",{children:[Object.keys(m).map((function(e){var t=m[e];return Object(u.jsxs)("div",{children:[Object(u.jsx)("span",{children:t.description}),Object(u.jsx)(y,{locked:o,config:t,value:t.default,onChange:function(n){"string"===t.type?v((function(c){return Object(i.a)(Object(i.a)({},c),{},Object(T.a)({},e,Object(i.a)(Object(i.a)({},t),{},{default:n.target.value})))})):"number"===t.type?v((function(c){return Object(i.a)(Object(i.a)({},c),{},Object(T.a)({},e,Object(i.a)(Object(i.a)({},t),{},{default:Object(j.toInteger)(n.target.value)})))})):v((function(c){return Object(i.a)(Object(i.a)({},c),{},Object(T.a)({},e,Object(i.a)(Object(i.a)({},t),{},{default:n.target.checked})))}))}})]},e)})),Object(u.jsx)("button",{onClick:function(){p(!0),n(b.a.fromPairs(Object.keys(m).map((function(e){return[e,m[e].default]}))))},children:"Save"})]})};var E=function(){var e=Object(c.useState)(x({})),t=Object(l.a)(e,2),n=t[0],r=t[1],a=Object(c.useState)(void 0),o=Object(l.a)(a,2),j=o[0],f=o[1],p=Object(c.useState)(!1),h=Object(l.a)(p,2),g=h[0],m=h[1],v=Object(c.useState)(""),y=Object(l.a)(v,2),C=y[0],D=y[1],T=Object(c.useState)(!1),E=Object(l.a)(T,2),W=E[0],z=E[1],H=Object(c.useState)(""),I=Object(l.a)(H,2),J=I[0],A=I[1],G=Object(c.useState)([]),L=Object(l.a)(G,2),M=L[0],B=L[1],_=Object(c.useState)([]),q=Object(l.a)(_,2),R=q[0],$=q[1],K=Object(c.useState)({}),Q=Object(l.a)(K,2),V=Q[0],X=Q[1],Y=Object(c.useCallback)((function(e){W&&r(e),N(M,{type:"updategame",game:e})}),[M,W]);return Object(c.useEffect)((function(){M&&W&&M.forEach((function(e){return N(e,{type:"peerlist",peers:R})}))}),[R,M,W]),Object(c.useEffect)((function(){console.log("Peer list got updated!",R)}),[R]),Object(c.useEffect)((function(){console.log("Connections list got updated!",M)}),[M]),Object(c.useEffect)((function(){return M.forEach((function(e){e.on("data",(function(e){var t,n=(t=e,JSON.parse(t));switch(console.log("Got data",n),n.type){case"newpeer":$((function(e){return console.log("Got new peer ".concat(n.peer,". Current"),e),[].concat(Object(s.a)(e),[n.peer])}));break;case"peerlist":$(n.peers);break;case"updategame":W?Y(n.game):r(n.game),m(!0)}})),e.on("open",(function(){console.log("Opened new conn!"),W||N(e,{type:"newpeer",peer:J})}))})),function(){M.forEach((function(e){e.off("data",void 0),e.off("open",void 0)}))}}),[M,W,J,Y]),Object(u.jsx)("div",{className:"App",children:Object(u.jsx)("header",{className:"App-header",children:g?Object(u.jsx)(u.Fragment,{children:n.winner?Object(u.jsxs)("span",{children:["We have a winner! Congrats ",n.winner.name]}):Object(u.jsxs)(u.Fragment,{children:[j&&Object(u.jsx)("div",{children:O.map((function(e){return Object(u.jsx)("button",{style:{backgroundColor:e},onClick:function(){Y(j(e)),f(void 0)},children:e},e)}))}),Object(u.jsxs)("div",{id:"player-hands",style:{display:"flex",justifyContent:"space-between"},children:[n.players.map((function(e,t){return Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(u.jsx)("span",{style:{color:n.currentPlayer===t?"green":"white"},children:e.name}),Object(u.jsx)("span",{children:e.cards.length}),Object(u.jsx)("ul",{children:e.cards.map((function(c,r){return Object(u.jsx)("div",{style:{margin:"3px"},children:Object(u.jsx)(d,{hidden:e.name!==J,onClick:function(){"wild"===c.color?f((function(){return function(e){return S(n,t,r,e)}})):Y(S(n,t,r))},card:c},r)},r)}))}),e.name===J&&Object(u.jsx)("button",{onClick:function(){e.name===J&&Y(function(e,t){if(e.currentPlayer!==t)return e;var n=k(e.deck),c=Object(l.a)(n,2),r=c[0],a=c[1];if(a.length>0){var o=Object(i.a)(Object(i.a)({},e),{},{deck:r,players:e.players.map((function(e,n){return n===t?Object(i.a)(Object(i.a)({},e),{},{cards:[].concat(Object(s.a)(e.cards),Object(s.a)(a))}):e})),currentDraws:e.currentDraws+1}),u=b.a.first(e.discard);return e.maxDraws>=1&&o.currentDraws>=e.maxDraws&&o.players[t].cards.every((function(t){return u&&!w(e,u,t)}))?Object(i.a)(Object(i.a)({},o),P(e)):o}return e}(n,t))},children:"Take card"})]},e.name)})),Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(u.jsx)("span",{children:"Top card"}),Object(u.jsx)(d,{card:b.a.first(n.discard)})]}),Object(u.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(u.jsxs)("span",{children:["POT: ",JSON.stringify(n.currentPot)," ="," ",b.a.sum(n.currentPot)]}),Object(u.jsxs)("span",{children:["Deck - ",n.deck.length]})]})]}),void 0!==n.unclaimedUno?Object(u.jsx)("div",{children:Object(u.jsxs)("button",{onClick:function(){Y(function(e,t){if(void 0===e.unclaimedUno)return e;var n=k(e.deck,e.unoPenalty),c=Object(l.a)(n,2),r=c[0],a=c[1];return e.unclaimedUno!==t?Object(i.a)(Object(i.a)({},e),{},{deck:r,players:e.players.map((function(t,n){return n===e.unclaimedUno?Object(i.a)(Object(i.a)({},t),{},{cards:[].concat(Object(s.a)(t.cards),Object(s.a)(a))}):t})),unclaimedUno:void 0}):Object(i.a)(Object(i.a)({},e),{},{unclaimedUno:void 0})}(n,n.players.findIndex((function(e){return e.name===J}))))},children:[n.players[n.unclaimedUno].name===J?"Claim":"Contest"," ","UNO!"]})}):Object(u.jsx)(u.Fragment,{})]})}):Object(u.jsxs)(u.Fragment,{children:[W?Object(u.jsxs)("div",{children:[Object(u.jsx)("button",{onClick:function(){var e=x(Object(i.a)(Object(i.a)({},V),{},{playerNames:R}));Y(e),m(!0)},children:"Start game"}),Object(u.jsx)(U,{readOnly:!1,setGameConfig:X})]}):(""!==J||""!==C)&&Object(u.jsx)("span",{children:"Wait for host to start the game"}),Object(u.jsx)("div",{children:Object(u.jsx)("ul",{children:R.map((function(e){return Object(u.jsx)("li",{children:e},e)}))})}),Object(u.jsx)("div",{children:Object(u.jsx)("input",{type:"text",placeholder:"Name",disabled:M.length>0||R.length>0,onChange:function(e){return A(e.target.value)},value:J})}),Object(u.jsx)("hr",{}),W&&Object(u.jsx)("div",{children:Object(u.jsxs)("span",{children:["Waiting for connections. Share your session ID: ",C]})}),!W&&0===M.length&&Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)("div",{children:Object(u.jsx)("button",{disabled:""===J,onClick:function(){var e=new F.a;e.on("open",(function(t){console.log("Listening in session",t),z(!0),$([J]),D(t),e.on("connection",(function(e){console.log("Received connection!",e),B((function(t){return[].concat(Object(s.a)(t),[e])}))}))}))},children:"Host a session"})}),Object(u.jsx)("span",{children:"or"}),Object(u.jsxs)("div",{children:[Object(u.jsx)("input",{type:"text",placeholder:"Session id",value:C,onChange:function(e){return D(e.target.value)}}),Object(u.jsx)("button",{disabled:""===C||""===J,onClick:function(){console.log("trying to connect to",C);var e=new F.a;e.on("open",(function(t){console.log("I have ID",t);var n=e.connect(C.trim());B((function(e){return[].concat(Object(s.a)(e),[n])}))}))},children:"Join a session"})]})]})]})})})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var W=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,23)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),c(e),r(e),a(e),o(e)}))};o.a.render(Object(u.jsx)(r.a.StrictMode,{children:Object(u.jsx)(E,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)})),W()}},[[22,1,2]]]);
//# sourceMappingURL=main.6100169d.chunk.js.map