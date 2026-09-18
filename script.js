(function(){
  var K='shevat_site_v1', state={text:{},img:{},theme:null};
  try{var s=localStorage.getItem(K); if(s) state=JSON.parse(s);}catch(e){}
  state.text=state.text||{}; state.img=state.img||{};
  function save(){try{localStorage.setItem(K,JSON.stringify(state));}catch(e){}}

  document.querySelectorAll('[data-edit]').forEach(function(el){
    var k=el.dataset.k; if(state.text[k]!=null) el.innerHTML=state.text[k];
  });
  function paint(box,src){
    var lab=box.querySelector('em');
    box.innerHTML='';
    var i=document.createElement('img'); i.alt=''; i.src=src; box.appendChild(i);
    if(lab) box.appendChild(lab);
  }
  document.querySelectorAll('[data-img]').forEach(function(b){
    if(state.img[b.dataset.img]) paint(b,state.img[b.dataset.img]);
  });
  if(state.theme) document.documentElement.setAttribute('data-theme',state.theme);

  var editing=false, eb=document.getElementById('edit');
  eb.onclick=function(){
    editing=!editing;
    document.body.classList.toggle('editing',editing);
    eb.classList.toggle('on',editing);
    eb.textContent=editing?'Done':'Edit content';
    document.querySelectorAll('[data-edit]').forEach(function(el){
      el.contentEditable=editing?'true':'false';
      if(editing) el.oninput=function(){state.text[el.dataset.k]=el.innerHTML; save();};
    });
  };

  var picker=document.getElementById('picker'), target=null;
  document.querySelectorAll('[data-img]').forEach(function(b){
    b.addEventListener('click',function(){ if(!editing) return; target=b; picker.value=''; picker.click(); });
  });
  picker.onchange=function(){
    var f=picker.files&&picker.files[0]; if(!f||!target) return;
    var r=new FileReader();
    r.onload=function(){ paint(target,r.result); state.img[target.dataset.img]=r.result; save(); };
    r.readAsDataURL(f);
  };

  var tb=document.getElementById('theme');
  function lab(){ tb.textContent = document.documentElement.getAttribute('data-theme')==='light' ? 'Dark' : 'Light'; }
  lab();
  tb.onclick=function(){
    var t=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';
    document.documentElement.setAttribute('data-theme',t); state.theme=t; save(); lab();
  };
  document.getElementById('reset').onclick=function(){ try{localStorage.removeItem(K);}catch(e){} location.reload(); };
  var sl=document.getElementById('slider'), ov=document.getElementById('over'), hb=document.getElementById('hbar');
  function setCmp(v){ ov.style.clipPath='inset(0 0 0 '+v+'%)'; hb.style.left=v+'%'; }
  sl.addEventListener('input',function(){ setCmp(sl.value); });
  setCmp(sl.value);

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    },{threshold:.15});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  document.getElementById('cform').onsubmit=function(e){
    e.preventDefault();
    var b=e.target.querySelector('button');
    b.textContent='Sent — thank you'; b.style.background='var(--clay)'; b.style.borderColor='var(--clay)'; b.style.color='#fff';
  };
})();