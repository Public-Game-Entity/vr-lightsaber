import React from 'react';

type MainType = {
    isOpen?: boolean
}


type TitleType = {
    children?: any
    fontSize?: number
    fontWeight?: number
    marginTop?: number
}

const Main = ({ isOpen = true }: MainType) => {
    return (
        <div style={{ display: isOpen ? "flex" : "none", justifyContent: "center", position: "absolute", width: '100%'}}>
            <div style={{ padding: "3rem 4rem" }}>
                <Title fontSize={3} fontWeight={700}>Light Saber</Title>
                <Title fontSize={1} fontWeight={500} marginTop={1}>This game is now the ultimate power in the universe! Play with VR</Title>
                <Title fontSize={1} fontWeight={500} marginTop={1}>- <a href="https://hhj.devent.kr/">@huh.hyeongjun</a></Title>
            </div>
        </div>
    );
};

const Title = ({ children, fontSize, fontWeight, marginTop }: TitleType) => {
    return (
        <div style={{ textAlign: "center", color: "#ffffff", fontSize: String(fontSize)+"rem", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: fontWeight, marginTop: String(marginTop)+"rem" }}>{children}</div>
    )
}


export default Main;