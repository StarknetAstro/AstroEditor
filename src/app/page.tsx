import {redirect} from "next/navigation";


export default function Home() {
    redirect('/editor');

    return null;
}