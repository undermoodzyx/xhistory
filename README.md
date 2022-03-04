### utools plugin xhistory

翻了 vscode 的源代码，后面发现打开的历史保存到 sqlite 的 ItemTable 里面了，
key 是 history.recentlyOpenedPathsList

```sql
-- 查询语句
select key, value from ItemTable where key = "history.recentlyOpenedPathsList";
```

1. 目前只支持 vscode 最近打开的项目
2. 后续支持模糊搜索