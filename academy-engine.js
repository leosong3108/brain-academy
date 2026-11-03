(function (G) {
'use strict';
const E = BrainEngine;
const COURSES = {
 gcd: {
  name: '数阵迷踪', title: '把所有格连成一条路', intro: '先看一个4格例子，再亲手练一题。', brief: '找公共因数，把所有格连成一条路。',
  goal: '从任意一格出发，连续走过所有格，每格只走一次。最后停在哪里都可以。',
  rules: [ ['上下左右相邻', '每一步只能移到当前格的上、下、左、右，不能斜着走，也不能跳格。'], ['两数有公共因数', '连接的两个数要能同时被同一个大于1的整数整除。例如6和10都能被2整除，就可以连接；6和7只有公共因数1，就不行。'], ['每格只走一次', '把全部格连成一条不断开的路线。不能重复经过；走进死胡同时可以撤回。'] ],
  controls: '依次点击格子来连接。点最后一格可退一步，“撤回一步”也可以；连满后点“检查答案”。',
  finish: '走满所有格，而且每一条连接都符合邻接和公共因数条件。参考路线只是一个可行解，其他合法路线同样算对。',
  mistakes: ['数字相同不是必须条件；能一起被2、3、5等数整除即可。','一条连接合法，不代表后面一定能走完。先留意剩余格是否被封住。'],
  demo: {rows:2, cols:2, values:[6,10,9,15], path:[0,1,3,2]},
  captions: [ ['从6出发', '先任选一个起点。这个例子从左上角的6开始。'], ['为什么6可以连到10？', '6和10都能被2整除，而且左右相邻，所以这一条连接合法。'], ['10接着连到15', '10和15都能被5整除，而且上下相邻。路线现在走过3格。'], ['15连到9，完成', '15和9都能被3整除。4格都走过一次，整条路线完成：6 → 10 → 15 → 9。'] ],
  exercise:{rows:2,cols:3,values:[6,10,14,9,21,35],solution:[0,1,2,5,4,3]},
  scale:'完整训练扩大到8×8，共64格；这里的小例子只用来学规则。'
 },
 hid: {
  name:'数字迷途',title:'补全一条数字路线',intro:'先看3×3的1–9例子，再亲手填一题。',brief:'根据提示，补全一条数字路线。',
  goal:'在空格里补数字。每个数字用一次，让1连2、2连3，一直连到最后一个数。',
  rules:[['固定数字不能改','灰底数字是题目给出的提示，只能填写白底空格。'],['数字连续且相邻','1和2必须上下左右相邻，2和3也必须相邻，依此类推。本网站采用四邻接，不能走斜线。'],['数字不漏不重','小例题必须把1–9各填一次；完整训练把1–81各填一次。不要把它当作每行1–9的数独。']],
  controls:'点击白色空格，输入数字。填完后点“检查答案”。方向键可以切换空格；灰色提示不能编辑。',
  finish:'全部数字恰好各出现一次，而且每两个连续数字都相邻。完整竞速中错交罚20秒，不会指出错处；入门跟练会解释错误。',
  mistakes:['每行、每列不需要各有1–9；检查的是整条连续路线。','位置上相邻还不够：数值也必须连续，如4接5。'],
  demo:{rows:3,cols:3,clues:[1,0,3,0,9,0,7,0,5],solution:[1,2,3,8,9,4,7,6,5],fills:[1,5,7,3]},
  captions:[['先找1、2、3的位置','1在左上，3在右上。中间只有一格，把2填在这里，就能连成1 → 2 → 3。'],['接着补4','3在右上，5在右下。它们之间的右侧中格应填4。'],['再补6','5在右下，7在左下。中间的下方空格填6。'],['最后补8，检查整条路','7在左下，9在正中。在左侧中格填8。现在沿1 → 2 → … → 9逐步检查，都上下左右相邻。']],
  exercise:{rows:3,cols:3,clues:[1,0,9,0,7,0,3,0,5],solution:[1,8,9,2,7,6,3,4,5]},
  scale:'完整训练是9×9、1–81。本网站使用21个提示、四邻接；每题已验证唯一解。'
 },
 pixel:{
  name:'闪光迷图',title:'让叠色结果与目标一致',intro:'先看两块小拼片怎样叠色，再亲手摆一题。',brief:'移动拼片，让叠色结果与目标一致。',
  goal:'把所有拼片摆进工作区，让每一格的颜色编号与目标图相同。拼片可以重叠。',
  rules:[['先看编号，再看颜色','颜色只是编号的显示方式：黑0、红1、橙2、黄3、绿4、青5、蓝6、紫7、白8。空白/透明孔对叠加贡献0。'],['同格相加，满9回到0','重叠时把同一格的编号相加，减去9的整数倍，只保留0–8。例如7+5=12，12减9得到3，显示黄色。不是颜料混色。'],['全部放入，逐格一致','所有拼片都要放入盘面，可以重叠但不能越界。本版只允许移动，不允许旋转。']],
  controls:'先点选拼片，再点放置坐标。坐标表示拼片左上角：行从上往下数，列从左往右数，均从1开始。可改位置，也可取下。',
  finish:'全部拼片都已放好，叠加结果的每一格都等于目标。位置不必与参考解相同，只要最终图一致就算完成。',
  mistakes:['0不改变另一块的数字；8+1=9，减9得到0。','先看编号运算。颜色视觉相近时，以格内的数字为准。'],
  demo:{rows:3,cols:3,parts:[{w:2,h:2,cells:[1,2,0,7],solution:{x:0,y:0}},{w:2,h:2,cells:[5,0,4,2],solution:{x:1,y:1}}]},
  captions:[['先看拼片1','第一块是2×2。把它的左上角放到第1行、第1列。还没有第二块，所以看到的就是第一块的编号。'],['再放拼片2','把第二块左上角放到第2行、第2列。它会盖在第一块右下角，两个数7和5落到同一格。'],['算出重叠格的颜色','正中间：7 + 5 = 12；12 − 9 = 3，显示黄色。其他格也按相同规则算。两块都放入，工作区与目标逐格相同。']],
  exercise:{rows:3,cols:3,parts:[{w:2,h:2,cells:[2,3,0,6],solution:{x:0,y:0}},{w:2,h:2,cells:[7,0,5,1],solution:{x:1,y:1}}]},
  scale:'完整训练是20×20目标、12块拼片。这里只用3×3、2块来学会放置和叠色。'
 }
};
function clone(x){return JSON.parse(JSON.stringify(x))}
function adjacent(a,b,cols){return Math.abs(a%cols-b%cols)+Math.abs(Math.floor(a/cols)-Math.floor(b/cols))===1}
function composite(q,placements){let out=Array(q.rows*q.cols).fill(0);placements.forEach((p,i)=>{if(!p)return;const part=q.parts[i];part.cells.forEach((v,j)=>{const at=(p.y+Math.floor(j/part.w))*q.cols+p.x+j%part.w;out[at]=(out[at]+v)%9})});return out}
for(const c of Object.values(COURSES))if(c.demo.parts){c.demo.target=composite(c.demo,c.demo.parts.map(p=>p.solution));c.exercise.target=composite(c.exercise,c.exercise.parts.map(p=>p.solution))}
function initial(id){let q=COURSES[id].exercise;return id==='gcd'?{path:[]}:id==='hid'?{cells:q.clues.map(v=>v?String(v):'')}:{placements:q.parts.map(()=>null),selected:0}}
function validAnswer(id,a){let q=COURSES[id].exercise;if(!a)return false;if(id==='gcd')return Array.isArray(a.path)&&a.path.length<=q.values.length&&new Set(a.path).size===a.path.length&&a.path.every((v,i)=>Number.isInteger(v)&&v>=0&&v<q.values.length&&(!i||adjacent(a.path[i-1],v,q.cols)&&E.gcd(q.values[a.path[i-1]],q.values[v])>1));if(id==='hid')return Array.isArray(a.cells)&&a.cells.length===9&&a.cells.every((v,i)=>typeof v==='string'&&/^\d?$/.test(v)&&(!v||+v>=1&&+v<=9)&&(!q.clues[i]||v===String(q.clues[i])));return Array.isArray(a.placements)&&a.placements.length===2&&[0,1].includes(a.selected)&&a.placements.every(p=>p===null||p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<=1&&p.y<=1)}
function apply(id,a,op){a=clone(a);let q=COURSES[id].exercise;if(op.type==='reset')return initial(id);if(id==='gcd'&&op.type==='path'){let v=op.cell,last=a.path.at(-1);if(v===last)a.path.pop();else{if(a.path.includes(v))throw Error('这个格已经走过。请撤回，不要重复经过。');if(last!==undefined&&!adjacent(last,v,q.cols))throw Error('这两格不在上下左右相邻位置。不能跳格或斜着走。');if(last!==undefined&&E.gcd(q.values[last],q.values[v])===1)throw Error(`${q.values[last]}和${q.values[v]}只有公共因数1，不能连接。试试其他相邻格。`);a.path.push(v)}}else if(id==='hid'&&op.type==='cell'){if(q.clues[op.cell])throw Error('灰底数字是固定提示，不能修改。');a.cells[op.cell]=String(op.value)}else if(id==='pixel'&&op.type==='select')a.selected=op.piece;else if(id==='pixel'&&op.type==='place')a.placements[a.selected]={x:op.x,y:op.y};else if(id==='pixel'&&op.type==='remove')a.placements[a.selected]=null;else throw Error('这一步操作不适用于本题。');if(!validAnswer(id,a))throw Error('请把数字或拼片放在题面允许的范围内。');return a}
function grade(id,a){let q=COURSES[id].exercise;if(!validAnswer(id,a))return {ok:false,message:'当前作答格式有误，请重置本小题。'};if(id==='gcd')return {ok:a.path.length===6,message:a.path.length===6?'6格都走过一次，每一条连接都合法。你已经会操作了。':`已经合法走过${a.path.length}/6格。还需要把剩余格连上，再检查。`};if(id==='hid'){let values=a.cells.map(Number);if(values.some(v=>!v))return {ok:false,message:'还有空格没填。请把1–9补齐，每个数字恰好出现一次。'};if(new Set(values).size!==9)return {ok:false,message:'有重复数字。1–9每个数字只能使用一次，请检查。'};for(let n=1;n<9;n++)if(!adjacent(values.indexOf(n),values.indexOf(n+1),3))return {ok:false,message:`${n}和${n+1}没有上下左右相邻。请检查这两个数字的位置。`};return {ok:true,message:'1–9没有重复或遗漏，每两个连续数字都相邻。跟练完成。'}}let filled=a.placements.filter(Boolean).length;if(filled!==2)return {ok:false,message:`已放${filled}/2块。先选一块拼片，再选择它左上角的坐标，把两块都放进工作区。`};let mismatch=composite(q,a.placements).flatMap((v,i)=>v===q.target[i]?[]:[i]);return {ok:!mismatch.length,message:mismatch.length?`还有${mismatch.length}格与目标不同。先看正中间的叠色，再移动拼片。`:'两块都放好，9格与目标完全一致。你已经学会放置与叠色。'}}
function blankCourse(id){return {stage:0,demo:0,answer:initial(id),trail:[],done:false,doneAt:0,attempts:0,hints:0}}
function empty(){return {schema:1,selected:'gcd',plan:{weeklyGoal:3,focus:'auto'},courses:Object.fromEntries(Object.keys(COURSES).map(id=>[id,blankCourse(id)]))}}
function validate(v){if(!v||v.schema!==1||!v.courses)throw Error('学习进度结构无效');let out=empty();if(v.selected!==undefined&&!COURSES[v.selected])throw Error('课程选择无效');out.selected=v.selected||'gcd';if(v.plan){if(![3,5,7].includes(v.plan.weeklyGoal)||!['auto',...Object.keys(COURSES)].includes(v.plan.focus))throw Error('Invalid training plan');out.plan=clone(v.plan)}for(let id of Object.keys(COURSES)){let c=v.courses[id];if(!c||!Number.isInteger(c.stage)||c.stage<0||c.stage>3||!Number.isInteger(c.demo)||c.demo<0||c.demo>=COURSES[id].captions.length||!validAnswer(id,c.answer)||!Array.isArray(c.trail)||c.trail.length>1000||!c.trail.every(a=>validAnswer(id,a))||typeof c.done!=='boolean'||!Number.isFinite(c.doneAt)||c.doneAt<0||!Number.isInteger(c.attempts)||c.attempts<0||!Number.isInteger(c.hints)||c.hints<0)throw Error('课程草稿或学习进度无效');out.courses[id]=clone(c)}return out}
function demoFrame(id,step){let q=COURSES[id].demo;if(id==='gcd')return {path:q.path.slice(0,step+1)};if(id==='hid'){let cells=q.clues.map(v=>v?String(v):'');for(let i of q.fills.slice(0,step+1))cells[i]=String(q.solution[i]);return {cells}}return {placements:q.parts.map((p,i)=>i<=step?clone(p.solution):null),selected:Math.min(step,1)}}
function metrics(state,id){const records=state.arena.records.filter(s=>BrainArena.get(s.caseId).kind===id),valid=records.filter(s=>BrainArena.result(s).eligible),unique=new Set(valid.map(s=>s.caseId)).size,notes=records.filter(s=>(s.note||'').trim().length>0).length;let latest=valid.at(-1),comparable=latest?valid.filter(s=>s.limitSec===latest.limitSec).slice(-3):[];let soloUnique=new Set(records.filter(s=>s.status==='completed'&&!s.hints&&!s.interruptions).map(s=>s.caseId)).size;return {records,valid,unique,soloUnique,notes,latest,comparable}}
G.BrainAcademy={COURSES,initial,apply,grade,validAnswer,validate,empty,demoFrame,composite,adjacent,metrics};
})(globalThis);
