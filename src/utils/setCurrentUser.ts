import removeCurrentUser from "./removeCurrentUser";

export default function setCurrentUser(user: string):void{
    removeCurrentUser();
    localStorage.setItem("currentUser", JSON.stringify(user));
}