const robotModels=[
 {name:'Smart Build Robotics — Thin-Set',material:'ceramic',maxKg:47.5,area:120,method:'adhesive',tile:'800–1500 × 600–800 mm',price:'Цена при запитване',image:'https://www.smartbuildrobotics.com/wp-content/uploads/2024/11/Automatic-Floor-Tile-Laying-Robot-Thin-Set-Installation.jpg'},
 {name:'Fangshi — Stone Tile Laying Robot',material:'stone',maxKg:120,area:100,method:'mortar',tile:'Голям формат / естествен камък',price:'Цена при запитване',image:'https://en.fangshitech.com/upload/image/20260522/a9e5e36fc56df335f1905eebc7354f05.png'},
 {name:'Partner Robotics P900',material:'ceramic',maxKg:30,area:18,method:'adhesive',tile:'300×300 – 600×1200 mm',price:'Цена при запитване',image:'https://sourcing-media.hktdc.com/original-file/914112943bb541e3ab2ac4cbbbe1c9ea?bucket=PUBLIC_ACCESS_MEDIA_BUCKET_550'},
 {name:'Zhuling Tile Laying Robot',material:'ceramic',maxKg:30,area:100,method:'adhesive',tile:'600×600 / 800×800 / 600×1200 mm',price:'Цена при запитване',image:'https://32786180.s21i.faiusr.com/4/ABUIABAEGAAg3OCRuQYowuvHxAMwtgM4pgM.png'},
 {name:'ProBuild Wall Tile Robot',material:'wall',maxKg:20,area:4.14,method:'adhesive',tile:'300 × 450–600 mm',price:'Цена при запитване',image:''}
];
const qs=s=>document.querySelector(s);
function initPremiumConfigurator(){
 const form=qs('#robot-configurator'); const result=qs('#config-result'); if(!form||!result)return;
 const update=()=>{const material=qs('#cfg-material').value;const kg=Number(qs('#cfg-weight').value||20);const area=Number(qs('#cfg-area').value||50);const method=qs('#cfg-method').value;
   const ranked=robotModels.map(r=>{let score=0;if(material==='any'||r.material===material)score+=5;if(r.maxKg>=kg)score+=3;else score-=6;if(r.area>=area)score+=2;else score-=Math.min(4,(area-r.area)/50);if(r.method===method)score+=3;return {...r,score}}).sort((a,b)=>b.score-a.score);const r=ranked[0];
   result.innerHTML=`<span class="match-badge">Препоръчана конфигурация</span><h3>${r.name}</h3><p>Подбрана според материала, теглото на плочата, метода на монтаж и ориентировъчната площ.</p><ul><li>Макс. товар: ${r.maxKg} kg</li><li>Публикувана производителност: до ${r.area} m²/ден или според модела</li><li>Работен формат: ${r.tile}</li></ul><div class="config-price">${r.price}</div><a class="btn btn-accent" href="#contact" data-config-contact="${r.name}">Поискай техническа оферта →</a><div class="premium-note">Окончателният модел се потвърждава след преглед на обекта и работния процес.</div>`;
   result.querySelector('[data-config-contact]')?.addEventListener('click',()=>{const msg=qs('#message');if(msg)msg.value=`Интересувам се от ${r.name}. Моля за техническа и търговска оферта.`});
 };
 form.addEventListener('input',update);form.addEventListener('change',update);update();
}
function initReveal(){const items=document.querySelectorAll('.premium-reveal');if(!('IntersectionObserver'in window)){items.forEach(x=>x.classList.add('is-visible'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});items.forEach(x=>io.observe(x));}
function initRobotCards(){document.querySelectorAll('.robot-card img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none';img.parentElement.classList.add('image-error')},{once:true}));}
document.addEventListener('DOMContentLoaded',()=>{initPremiumConfigurator();initReveal();initRobotCards();});
