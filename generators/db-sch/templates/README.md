hcsp Application

Build Command:
```
cd hanacloud_schema_plan ; mkdir -p mta_archives ; mbt build -p=cf -t=mta_archives --mtar=hanacloud_schema_plan.mtar
```

Deploy Command:
```
cf deploy mta_archives/hanacloud_schema_plan.mtar -f
```

Undeploy Command:
```
cf undeploy hcsp -f --delete-services
```
