# claw养殖技术

## claw分类

## openclaw安装和使用

docker镜像 debian:12

docker run -it --rm debian:12 /bin/bash

apt update; \
    apt install -y vim net-tools socat procps bsdmainutils curl git; \
    apt install -y python3 python3-pip; \
    ln -s /usr/bin/python3 /usr/bin/python; 


curl -fsSL https://openclaw.ai/install.sh | bash
    nodejs
    npm
    openclaw
        npm install -g openclaw@latest
    第一次启动openclaw时的命令
        openclaw onboard --install-daemon

## nanobot安装和使用

docker镜像 debian:12

apt update; \
    apt install -y vim net-tools socat procps bsdmainutils curl git; \
    apt install -y python3 python3-pip; \
    ln -s /usr/bin/python3 /usr/bin/python; \
    python -m pip install nanobot-ai --break-system-packages;


nanobot --version

nanobot onboard

vim ~/.nanobot/config.json

{
  "providers": {
    "custom": {
      "apiKey": "",
      "apiBase": ""
    }
  },
  "agents": {
    "defaults": {
      "workspace": "~/.nanobot-telegram/workspace",
      "model": ""
    }
  },
  "channels": {
    "matrix": {
      "enabled": false,
      "homeserver": "https://matrix.org",
      "userId": "@nanobot:matrix.org",
      "accessToken": "syt_xxx",
      "deviceId": "NANOBOT01",
      "e2eeEnabled": true,
      "allowFrom": ["@your_user:matrix.org"],
      "groupPolicy": "open",
      "groupAllowFrom": [],
      "allowRoomMentions": false,
      "maxMediaBytes": 20971520
    }
  },
  "gateway": {
    "port": 18790
  }
}


nanobot agent -m "Hello"


```
nanobot/
├── .nanobot/      
│   ├── config.json
└── workspace/        
│   ├── defaults
│   │   ├──memory
│   │   ├──sessions
│   │   ├──skills
│   │   ├──AGENTS.md
│   │   ├──HEARTBEAT.md
│   │   ├──SOUL.md
│   │   ├──TOOLS.md
│   │   └──USER.md
└── └── test1
│   │   ├──memory
│   │   ├──sessions
│   │   ├──skills
│   │   ├──AGENTS.md
│   │   ├──HEARTBEAT.md
│   │   ├──SOUL.md
│   │   ├──TOOLS.md
└── └── └──USER.md
```

这种写法可能无法读取skill 会提示 file not found
python -m nanobot agent --config ./.nanobot/config.json -w "./workspace/test1" -m "hello"

这种写法可以读取skill
python -m nanobot agent --config ./.nanobot/config.json -w "workspace/test1" -m "hello"

## matrix安装和使用

### 服务端
### 客户端
web
安卓

