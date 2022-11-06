# Windows 下通过 PEB 读取进程的环境变量

Windows 下没有能 api 能直接读取进程的环境变量。
wmi 和 powershell 也没有方式能读取进程的环境变量。
在 powershell 5.1 里确实可以通过象这样的命令读取环境变量，但这并不是进程的环境变量。
```powershell
([System.Diagnostics.Process]::GetProcessesByName("php-cgi") | Select-Object -First 1 ).StartInfo.EnvironmentVariables
([System.Diagnostics.Process]::GetProcessesByName("php-cgi") | Select-Object -First 1 ).StartInfo.Environment
```

## 进程的 PEB

Windows 下只能通过 PEB 来读取环境变量。
PEB 是一个臃肿的结构体，且 msdn 里没有这个结构体的详细信息。
PEB 的具体结构根据操作系统的版本不同而不同，也和进程的位数有关。
PEB 里除了环境变量，还是有执行目录，可执行文件路径，命令行等信息。

笔者在网上搜索了很久才在这个站点里找到 PEB 详细的结构
http://terminus.rewolf.pl/terminus

通过 PEB 读取进程的环境变量的具体流程
1. 获取进程id
    - 获取进程id的方式有非常多，最简单的方式就是通过任务管理器
1. 获取进程的句柄（Handle）
    - 可以通过这个 `OpenProcess` api 来获取
1. 根据 Handle 获取 PBI (PROCESS_BASIC_INFORMATION)
    - 可以通过这个 `NtQueryInformationProcess` api 来获取
1. 从 PBI 中获取 PEB
    - 在结构体 PROCESS_BASIC_INFORMATION 中的 PebBaseAddress
1. 从 PEB 中获取 ProcessParameters
    - 通过这个 `ReadProcessMemory` api 来获取
1. 从 ProcessParameters 中获取 environment
    - 通过这个 `ReadProcessMemory` api 来获取
    - 在 win10 下，可以通过 ProcessParameters 中的 EnvironmentSize 获取环境变量具体的长度
    - win10 以下的版本只能通过逐个读取字符和空字符判断环境变量的长度
    - 读取的结果是一个连续的字符串，使用 `\0` 字符来分隔环境变量，使用连续的两个 `\0` 字符表示结束

相关的 结构体 和 api
- PEB
- PROCESS_BASIC_INFORMATION
- PROCESS_BASIC_INFORMATION_WOW64
- RTL_USER_PROCESS_PARAMETERS
- OpenProcess
- IsWow64Process
- NtQueryInformationProcess
- NtWow64QueryInformationProcess64
- ReadProcessMemory

这些 api 的文档里大多有这样的一句声明。
> “在未来的Windows版本中可能会修改”

~~笔者其实不理解象PEB这么重要的结构微软为什么不公开详细的信息~~

## 读取进程环境变量的脚本

这是一段使用 powershell 通过 win32api 读取进程 PEB 中的环境变量的脚本。

这段脚本没有做太多的兼容性处理，估计只能运行在 64 位 win10 上，且只能用 64 位的 powershell 查询 64 位的进程。

这段脚本很容易被安全软件判断为恶意脚本。

PEB 的结构每个版本的 Windows 都有一点差异， 32位和64位也有明显的差异，还有考虑 WoW64 的环境，还要考虑各个版本的 powershell 的语法差异。
要写一段兼容性好的脚本是一件麻烦的事，各种环境下都测试一次，笔者没有这样的条件~（笔者已经理解了大概的原理，没有动力完善了）~
笔者在网上找到的脚本大多不能直接使用，就是兼容性的问题。

note
- 要先确认当前的 Windows 版本，然后再查找对应 PEB 的结构
- 进程的数据要用 ReadProcessMemory 读取，即使是字符串
- 可以用 IsWow64Process 判断是不是 WoW64 的环境。
- WoW64 的环境的 PBI 要用这个结构体 PROCESS_BASIC_INFORMATION_WOW64

```powershell
function Get-ProcessEnvironmentVariables {

    param(
        [int]$ProcessId
    )

    BEGIN
    {
        # Native API Definitions
        Add-Type -TypeDefinition @"
            using System;
            using System.Diagnostics;
            using System.Runtime.InteropServices;
            using System.Security.Principal;

            [StructLayout(LayoutKind.Sequential)]
            public struct UNICODE_STRING
            {
                public UInt16 Length;
                public UInt16 MaximumLength;
                public IntPtr Buffer;
            }

            [StructLayout(LayoutKind.Sequential)]
            public struct PROCESS_BASIC_INFORMATION
            {
                public IntPtr ExitStatus;
                public IntPtr PebBaseAddress;
                public IntPtr AffinityMask;
                public IntPtr BasePriority;
                public UIntPtr UniqueProcessId;
                public IntPtr InheritedFromUniqueProcessId;
            }

            public static class ProcessEnvironmentHelper
            {
                [DllImport("kernel32.dll")]
                public static extern Boolean ReadProcessMemory( 
                    IntPtr hProcess, 
                    IntPtr lpBaseAddress,
                    IntPtr lpBuffer,
                    UInt32 dwSize, 
                    ref UInt32 lpNumberOfBytesRead
                );

                [DllImport("ntdll.dll")]
                public static extern UInt32 NtQueryInformationProcess(
                    IntPtr processHandle, 
                    UInt32 processInformationClass,
                    ref PROCESS_BASIC_INFORMATION processInformation,
                    UInt32 processInformationLength,
                    ref UInt32 returnLength
                );
            }
"@
        function Get-PBI {
            param(
                [IntPtr]$hProcess
            )

            $PROCESS_BASIC_INFORMATION = New-Object PROCESS_BASIC_INFORMATION
            $PROCESS_BASIC_INFORMATION_Size = [System.Runtime.InteropServices.Marshal]::SizeOf($PROCESS_BASIC_INFORMATION)
            [UInt32]$RetLen = 0
            $CallResult = [ProcessEnvironmentHelper]::NtQueryInformationProcess(
                $hProcess,
                0,
                [ref]$PROCESS_BASIC_INFORMATION,
                $PROCESS_BASIC_INFORMATION_Size,
                [ref]$RetLen
            )
            if ($CallResult -ne 0) {
                $false
            } else {
                $PROCESS_BASIC_INFORMATION
            }
        }

    }

    PROCESS
    {

        $hProcess = [System.Diagnostics.Process]::GetProcessById($ProcessId).SafeHandle.DangerousGetHandle()
        Write-Host "[+] ProcessId " $ProcessId
        Write-Host "[+] Handle " $hProcess

        # Get process basic information
        $ProcessBasicInformation = Get-PBI -hProcess $hProcess
        Write-Host "[+] PBI " $ProcessBasicInformation

        # Get PEBAddress
        $PEBAddress = $ProcessBasicInformation.PebBaseAddress.ToInt64()
        Write-Host "[+] PEB " $PEBAddress

        # Get ProcessParameters
        $AddressOffset = $PEBAddress + 0x20 # 64位
        $ReadSize = 8
        $BytesRead = 0
        [IntPtr]$lpBuffer = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($ReadSize)
        $CallResult = [ProcessEnvironmentHelper]::ReadProcessMemory(
            $hProcess,
            $AddressOffset,
            $lpBuffer,
            $ReadSize,
            [ref]$BytesRead
        )
        $ProcessParametersAddress = [System.Runtime.InteropServices.Marshal]::ReadInt64($lpBuffer.ToInt64())

        # Get EnvironmentSize
        $EnvironmentSizeAddress = $ProcessParametersAddress + 0x03F0
        $AddressOffset = $EnvironmentSizeAddress
        $ReadSize = 8
        $BytesRead = 0
        [IntPtr]$lpBuffer = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($ReadSize)
        $CallResult = [ProcessEnvironmentHelper]::ReadProcessMemory(
            $hProcess,
            $AddressOffset,
            $lpBuffer,
            $ReadSize,
            [ref]$BytesRead
        )
        $EnvironmentSize = [System.Runtime.InteropServices.Marshal]::ReadInt64($lpBuffer.ToInt64())
        Write-Host "[+] EnvironmentSize " $EnvironmentSize

        # Get Environment
        $EnvironmentAddress = $ProcessParametersAddress + 0x0080
        $AddressOffset = $EnvironmentAddress
        $ReadSize = 8
        $BytesRead = 0
        [IntPtr]$lpBuffer = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($ReadSize)
        $CallResult = [ProcessEnvironmentHelper]::ReadProcessMemory(
            $hProcess,
            $AddressOffset,
            $lpBuffer,
            $ReadSize,
            [ref]$BytesRead
        )

        $AddressOffset = [System.Runtime.InteropServices.Marshal]::ReadInt64($lpBuffer.ToInt64())
        $ReadSize = $EnvironmentSize
        $BytesRead = 0
        [IntPtr]$lpBuffer = [System.Runtime.InteropServices.Marshal]::AllocHGlobal($ReadSize)
        $CallResult = [ProcessEnvironmentHelper]::ReadProcessMemory(
            $hProcess,
            $AddressOffset,
            $lpBuffer,
            $ReadSize,
            [ref]$BytesRead
        )
        $ProcessEnvironmentVariables = [System.Runtime.InteropServices.Marshal]::PtrToStringAnsi($lpBuffer, $EnvironmentSize)

        # Convert string to hashTable
        $ProcessEnvironmentVariables = [System.Convert]::ToString($ProcessEnvironmentVariables)
        $ProcessEnvironmentVariables = $ProcessEnvironmentVariables.Replace("`0`0", "`n")
        $ProcessEnvironmentVariables = $ProcessEnvironmentVariables.Replace("`0", "")
        if ($ProcessEnvironmentVariables[0] -eq '=') {
            $ProcessEnvironmentVariables = $ProcessEnvironmentVariables.Split("`n")
            $ProcessEnvironmentVariables = [System.Collections.ArrayList]::new($ProcessEnvironmentVariables)
            $ProcessEnvironmentVariables.RemoveAt(0)
            $ProcessEnvironmentVariables = $ProcessEnvironmentVariables.ToArray()
            $ProcessEnvironmentVariables = $ProcessEnvironmentVariables -join "`n"
        }
        $ProcessEnvironmentVariables = $ProcessEnvironmentVariables.Replace("\", "\\")
        $ProcessEnvironmentVariables = ConvertFrom-StringData -StringData $ProcessEnvironmentVariables

        return $ProcessEnvironmentVariables

    }
}

# $Id = ([System.Diagnostics.Process]::GetProcessesByName("php-cgi") | Select-Object -First 1 ).Id
# Get-ProcessEnvironmentVariables -ProcessId $Id

```

## 参考
- https://docs.microsoft.com/en-us/windows/win32/api/winternl/nf-winternl-ntqueryinformationprocess
- https://docs.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-readprocessmemory
- https://docs.microsoft.com/en-us/windows/win32/api/winternl/ns-winternl-peb
- https://docs.microsoft.com/en-us/windows/win32/api/winternl/ns-winternl-rtl_user_process_parameters
- http://terminus.rewolf.pl/terminus/structures/ntdll/_PEB_x64.html
- http://terminus.rewolf.pl/terminus/structures/ntdll/_RTL_USER_PROCESS_PARAMETERS_x64.html
- https://www.powershellgallery.com/packages/PowerSploit/1.0.0.0/Content/ReverseEngineering%5CGet-PEB.ps1
- https://stackoverflow.com/questions/38660262/how-to-get-other-processs-environment-variable-using-c-sharp
- https://gist.github.com/xenoscr/99370ecffb07f629ae74e7808cb91450
- http://blog.rewolf.pl/blog/?cat=19
