interface Props {
    setGameOver: (arg0: boolean) => void;
}

export default function Game(props:Props) {

    const width = window.innerWidth;
    const height = window.innerHeight;

    return(
        <div>
            game started
        </div>
    )
}