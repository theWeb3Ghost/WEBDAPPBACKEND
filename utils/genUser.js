export default function genUser(name){
    const clean= (name|| "user").toLowerCase().replace(/[^a-z]/g, "");
    const base= (clean + "xxxx").slice(0,4);
    const rand=Math.floor(10 + Math.random()* 90);
    return(base +rand).slice(0,6);
}