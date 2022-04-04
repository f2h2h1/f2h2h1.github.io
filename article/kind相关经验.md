# kind 相关经验

kind 是 k8s in docker 的缩写

先安装 kind 再安装 kubctl ， kubectl 的版本要根据 kind 来决定

和 minikube mricrok8s 相比， kind 节点运行在 docker 里，对宿主机影响比较小可以放心的折腾。
kind 也是 k8s 官方文档里推荐的学习环境之一。

## 大概的运行环境

- debian 11
- kind 0.12
- k8s 1.23
- docker 20.10.13

## 安装 kind

```
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.12.0/kind-linux-amd64
chmod +x ./kind
mv ./kind /usr/local/kind
```

参考 https://kind.sigs.k8s.io/docs/user/quick-start/

## kind 常用命令

- 查看帮助
    ```
    kind help
    ```

- 创建集群
    ```
    kind create cluster # 默认的集群名是 kind
    kind create cluster --name kind-2
    ```

- 查看当前的集群
    ```
    kind get clusters
    ```

- 删除集群
    ```
    kind delete cluster
    kind delete cluster --name kind-2
    ```

## 安装 kubectl

生成 kubeconfig 文件
```
kind get kubeconfig --name="kind" > kubeconfig
```

### 使用 docker 容器

1. 拉取 kubectl 的镜像
    ```
    docker pull bitnami/kubectl:1.23
    ```

1. 尝试运行
    ```
    docker run --rm -it \
        --network=host \
        -v `pwd`/kubeconfig:/.kube/kubeconfig \
        bitnami/kubectl:1.23 --kubeconfig=/.kube/kubeconfig \
        get nodes
    ```

1. 设置别名
    1. 修改 ~/.bashrc ，要注意修改 kubeconfig 的路径
        ```
        alias kubectl="docker run --rm -it --network=host -v /root/kubeconfig:/.kube/kubeconfig bitnami/kubectl:1.23 --kubeconfig=/.kube/kubeconfig"
        ```
    1. 运行 `source ~/.bashrc`

1. 之后就可以直接在命令行里使用 kubectl 命令了，但因为使用了容器，如果要上传或下载文件，还是需要用原始的 docker 命令

### 使用原生程序

```
curl -LO https://dl.k8s.io/release/v1.23.1/bin/linux/amd64/kubectl && \
chmod +x ./kubectl && \
mv ./kubectl /bin/kubectl
```

使用原生程序，需要把 kubeconfig 复制到 ~/.kube/kubeconfig

## 新建集群

删除原本的默认集群，原本的默认集群只有一个 master 节点
```
kind delete cluster
```

新建一个集群，集群里有一个 master 节点和一个 worker 节点

1. 新建一个文件 kind-config.yaml
    ```
    apiVersion: kind.sigs.k8s.io/v1alpha3
    kind: Cluster
    nodes:
        - role: control-plane
        - role: worker
    ```

1. 运行新建集群的命令
    ```
    kind create cluster --name kind2 --config=kind-config.yaml
    ```

1. 查看集群信息
    ```
    kubectl cluster-info --context kind-kind-2
    ```

## kubectl 常用命令

- 查看集群的信息
    ```
    kubectl cluster-info --context kind-kind # kind-集群名
    kubectl cluster-info --context kind-kind-2
    ```

- 查看命令空间
    ```
    kubectl get namespaces
    ```

- 查看命令空间下的 pods
    ```
    kubectl -n namespaces get pods
    ```

## 安装 kubernetes-dashboard

1. 下载并运行配置文件
    ```
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.0/aio/deploy/recommended.yaml
    ```

1. 启动代理
    ```
    kubectl proxy
    ```

1. 访问
    ```
    http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
    ```

1. 如果需要远程访问（假设k8s是部署在远程服务器上，且需要在本地访问）
    - 用 ssh 的转发
        ```
        ssh -o ServerAliveInterval=60 -L localhost:8001:localhost:8001 -NT username@hostname
        ```

- 默认情况下 kubernetes-dashboard 只能在本地访问
- kubectl proxy 命令常用参数
    - h 查看帮助
    - accept-hosts 表示哪些客户端访问,默认只允许 localhost 和 127.0.0.1
    - address 表示本机绑定的ip地址，默认是 127.0.0.1
    - port 表示代理的接口，如果值为 0 的话，则随机一个端口，可以通过一开始的输出判断绑定了哪个端口
- 如果使用 token 的方式登录则需要新建一个用户

参考 https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/

## 新建一个用户

主要是为了能登入 dashboard

1. 新建 dashboard-adminuser.yaml
    ```yaml
    apiVersion: v1
    kind: ServiceAccount
    metadata:
        name: admin-user
        namespace: kubernetes-dashboard

    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
        name: admin-user
    roleRef:
        apiGroup: rbac.authorization.k8s.io
        kind: ClusterRole
        name: cluster-admin
    subjects:
    - kind: ServiceAccount
        name: admin-user
        namespace: kubernetes-dashboard
    ```

1. 上面那个 yaml 文件，是新建老一个 ServiceAccount ，并给这个用户绑定了一个角色
1. 运行配置文件
    ```
    kubectl apply -f dashboard-adminuser.yaml
    ```
1. 获得 token
    ```
    kubectl -n kubernetes-dashboard get secret $(kubectl -n kubernetes-dashboard get sa/admin-user -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
    ```

参考 https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md
