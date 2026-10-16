// Circuit trace field with travelling pulses
function circuitPulse() {
    var c=document.getElementById('field'),x=c.getContext('2d'),W,H,dpr,paths=[],pulses=[],G=34;
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function col(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
    function rnd(a,b){return a+Math.random()*(b-a)}
    function build(){
        dpr=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;
        c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
        paths=[];var n=Math.round(W*H/26000);
        for(var i=0;i<n;i++){
        var px=Math.round(rnd(0,W)/G)*G,py=Math.round(rnd(0,H)/G)*G,p=[[px,py]],dir=Math.random()<.5?0:1,len=3+Math.floor(Math.random()*5);
        for(var k=0;k<len;k++){
            var s=G*(1+Math.floor(Math.random()*3)),sg=Math.random()<.5?-1:1;
            if(dir===0)px+=s*sg;else py+=s*sg;
            if(Math.random()<.5){ // 45° jog like the logo traces
            px+=G*(Math.random()<.5?-1:1);py+=G*(Math.random()<.5?-1:1);
            }
            p.push([px,py]);dir=1-dir;
        }
        var L=0;for(var j=1;j<p.length;j++)L+=Math.hypot(p[j][0]-p[j-1][0],p[j][1]-p[j-1][1]);
        paths.push({p:p,L:L});
        }
        pulses=paths.slice().sort(function(){return Math.random()-.5}).slice(0,Math.max(4,Math.round(W/160))).map(function(pt){return{pt:pt,t:Math.random(),v:rnd(.0008,.002)}});
    }
    function at(pt,t){
        var d=t*pt.L,p=pt.p;
        for(var j=1;j<p.length;j++){var a=p[j-1],b=p[j],l=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<=l){var f=l?d/l:0;return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]}d-=l}
        return p[p.length-1];
    }
    function draw(){
        x.clearRect(0,0,W,H);
        var tr=col('--trace'),pc=col('--pulse');
        x.lineWidth=1.5;x.strokeStyle=tr;x.fillStyle=tr;
        paths.forEach(function(pt){
        x.beginPath();pt.p.forEach(function(q,i){i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.stroke();
        var e=pt.p[pt.p.length-1];x.beginPath();x.arc(e[0],e[1],3.5,0,7);x.stroke();
        });
        pulses.forEach(function(u){
        var q=at(u.pt,u.t);
        var g=x.createRadialGradient(q[0],q[1],0,q[0],q[1],14);
        g.addColorStop(0,pc);g.addColorStop(1,'transparent');
        x.fillStyle=g;x.beginPath();x.arc(q[0],q[1],14,0,7);x.fill();
        x.fillStyle=pc;x.beginPath();x.arc(q[0],q[1],2.4,0,7);x.fill();
        });
    }
    function tick(){pulses.forEach(function(u){u.t+=u.v;if(u.t>1){u.t=0}});draw();requestAnimationFrame(tick)}
    build();draw();
    var to;addEventListener('resize',function(){clearTimeout(to);to=setTimeout(function(){build();draw()},150)});
    if(!reduce)requestAnimationFrame(tick);
}
